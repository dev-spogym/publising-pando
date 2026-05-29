import type { DialogDefinition, PermissionKey, RoleId, ScreenDefinition } from "./registry";

export type HandoffStatus = "production-ready" | "template-ready" | "policy-pending" | "external-integration-pending";

export type ApiContract = {
  key: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  endpoint: string;
  purpose: string;
  requestShape: string;
  responseShape: string;
  errorStates: string[];
  mocked: true;
};

export type FieldContract = {
  name: string;
  label: string;
  type: "text" | "number" | "date" | "select" | "textarea" | "checkbox";
  required: boolean;
  validation: string;
};

export type ActionContract = {
  actionId: string;
  label: string;
  requiredPermission?: PermissionKey;
  allowedRoles: RoleId[];
  blockedReason: string;
  payloadShape: string;
  successToast: string;
  failureState: string;
  auditRequired: boolean;
  mockBehavior: "open-dialog" | "toast" | "local-state";
};

export type ScreenContract = {
  handoffStatus: HandoffStatus;
  queryParams: FieldContract[];
  tableSchema: FieldContract[];
  stateMatrix: string[];
  apiContracts: ApiContract[];
  actionContracts: ActionContract[];
  developerNotes: string[];
};

export type DialogContract = {
  handoffStatus: HandoffStatus;
  fields: FieldContract[];
  submitContract: ApiContract;
  stateMatrix: string[];
};

const domainSlugs: Record<string, string> = {
  D01: "common",
  D02: "members",
  D03: "sales",
  D04: "classes",
  D05: "products",
  D06: "facilities",
  D07: "staff",
  D08: "marketing",
  D09: "settings",
  D10: "hq",
  D11: "integrated"
};

const rolesByPermission: Record<PermissionKey, RoleId[]> = {
  viewAllBranches: ["HQ_ADMIN"],
  memberWrite: ["OWNER", "MANAGER", "FC"],
  dangerMember: ["OWNER"],
  transfer: ["OWNER"],
  bodyWrite: ["OWNER", "MANAGER", "TRAINER"],
  salesWrite: ["OWNER", "MANAGER", "FC", "STAFF"],
  refundApprove: ["OWNER"],
  installment: ["OWNER", "MANAGER"],
  taxInvoice: ["HQ_ADMIN", "OWNER"],
  targetManage: ["HQ_ADMIN", "OWNER"]
};

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/scr-|dlg-/g, "")
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-|-$/g, "");
}

function inferFieldType(label: string): FieldContract["type"] {
  if (/일|날짜|기간|생년|시각|시간/.test(label)) return "date";
  if (/금액|횟수|수량|번호|건수|율|점수|체중|BMI/i.test(label)) return "number";
  if (/상태|지점|담당|역할|권한|유형|구분|수단|등급/.test(label)) return "select";
  if (/메모|사유|내용|비고|설명|코멘트/.test(label)) return "textarea";
  if (/동의|여부|토글/.test(label)) return "checkbox";
  return "text";
}

function makeField(label: string, index: number, required = index < 2): FieldContract {
  return {
    name: `${slug(label) || `field-${index + 1}`}`,
    label,
    type: inferFieldType(label),
    required,
    validation: required ? "필수 입력, 빈 값 제출 시 inline error 표시" : "선택 입력, 형식 오류 시 inline helper 표시"
  };
}

function endpointFor(item: Pick<ScreenDefinition | DialogDefinition, "domain" | "id"> & Partial<Pick<ScreenDefinition, "route">>) {
  if (item.route) {
    const routePath = item.route === "/" ? "" : item.route.replace(/\/detail$/, "/:id").replace(/\/edit$/, "/:id");
    return `/api/admin${routePath}`;
  }
  return `/api/admin/${domainSlugs[item.domain] ?? "v1"}/dialogs/${slug(item.id)}`;
}

export function getHandoffStatus(item: Pick<ScreenDefinition | DialogDefinition, "domain" | "id" | "policyPending">): HandoffStatus {
  if (item.policyPending) return "policy-pending";
  if (item.domain === "D03" && /(환불|세금|선수익|예측)/.test(item.id)) return "external-integration-pending";
  if (["D01", "D02", "D03"].includes(item.domain)) return "production-ready";
  return "template-ready";
}

export function getActionContract(screen: ScreenDefinition, action: ScreenDefinition["primaryActions"][number], index: number): ActionContract {
  const allowedRoles: RoleId[] = action.permission ? rolesByPermission[action.permission] : ["HQ_ADMIN", "OWNER", "MANAGER", "FC", "TRAINER", "STAFF"];
  return {
    actionId: `${screen.id}.${slug(action.label) || `action-${index + 1}`}`,
    label: action.label,
    requiredPermission: action.permission,
    allowedRoles,
    blockedReason: action.permission ? `${action.permission} 권한 필요` : "모든 역할 실행 가능",
    payloadShape: action.dialogId ? `{ dialogId: "${action.dialogId}", sourceScreenId: "${screen.id}", formValues }` : `{ sourceScreenId: "${screen.id}", selectedRows, filters }`,
    successToast: `${action.label} 처리 완료`,
    failureState: "권한 부족, 필수값 누락, 정책 확인 필요, 외부 연동 실패 상태 표시",
    auditRequired: Boolean(action.danger || /삭제|환불|승인|이관|퇴사|권한/.test(action.label)),
    mockBehavior: action.dialogId ? "open-dialog" : "toast"
  };
}

export function getScreenContract(screen: ScreenDefinition): ScreenContract {
  const actionContracts = screen.primaryActions.map((action, index) => getActionContract(screen, action, index));
  return {
    handoffStatus: getHandoffStatus(screen),
    queryParams: screen.filters.slice(0, 8).map((filter, index) => makeField(filter, index, false)),
    tableSchema: screen.tableColumns.map((column, index) => makeField(column, index, index < 1)),
    stateMatrix: ["loading skeleton", "empty state", "filtered result", "validation error", "permission blocked", "policy pending", "success toast"],
    apiContracts: [
      {
        key: `${screen.id}.list`,
        method: "GET",
        endpoint: endpointFor(screen),
        purpose: `${screen.title} 목록/상세 화면 초기 데이터 조회`,
        requestShape: `{ query: ${screen.filters.map((filter) => slug(filter)).join(" | ") || "none"} }`,
        responseShape: `{ screenId: "${screen.id}", rows, metrics, permissions, policyFlags }`,
        errorStates: ["401 unauthenticated", "403 forbidden", "422 invalid filter", "500 server error"],
        mocked: true
      },
      ...actionContracts.map((action) => ({
        key: action.actionId,
        method: action.auditRequired ? "POST" as const : "PATCH" as const,
        endpoint: `${endpointFor(screen)}/actions/${slug(action.label)}`,
        purpose: `${screen.title} - ${action.label} 처리`,
        requestShape: action.payloadShape,
        responseShape: `{ ok: true, toast: "${action.successToast}", updatedRows?, nextState? }`,
        errorStates: ["403 forbidden", "409 conflict", "422 validation error", "policy-pending"],
        mocked: true as const
      }))
    ],
    actionContracts,
    developerNotes: [
      `${screen.source} 기준 화면 ID/목적/연결 DLG 유지`,
      "화면 계약 범위에서는 목데이터와 화면 상태로 처리",
      "실개발 시 apiContracts.endpoint를 실제 backend route로 치환"
    ]
  };
}

export function getDialogContract(dialog: DialogDefinition): DialogContract {
  const fields = dialog.components.map((component, index) => makeField(component, index, index < 2));
  return {
    handoffStatus: getHandoffStatus(dialog),
    fields,
    submitContract: {
      key: `${dialog.id}.submit`,
      method: dialog.destructive ? "DELETE" : "POST",
      endpoint: endpointFor(dialog),
      purpose: `${dialog.title} 확인 액션`,
      requestShape: `{ dialogId: "${dialog.id}", values: { ${fields.map((field) => field.name).join(", ")} }, actorRole, sourceScreenId }`,
      responseShape: `{ ok: true, toast, nextState?, auditLogId? }`,
      errorStates: ["403 forbidden", "409 conflict", "422 validation error", "external-integration-pending"],
      mocked: true
    },
    stateMatrix: ["open", "dirty", "invalid", "submitting", "success toast", "permission blocked", "closed"]
  };
}
