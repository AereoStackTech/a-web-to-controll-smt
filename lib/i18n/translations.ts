export type SupportedLanguage = "en" | "es" | "fr" | "de" | "ja" | "zh" | "pt" | "ar";

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  dir: "ltr" | "rtl";
  region: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", dir: "ltr", region: "US / Global" },
  { code: "es", name: "Spanish", nativeName: "Español", dir: "ltr", region: "España / LATAM" },
  { code: "fr", name: "French", nativeName: "Français", dir: "ltr", region: "France / Intl" },
  { code: "de", name: "German", nativeName: "Deutsch", dir: "ltr", region: "Deutschland / DACH" },
  { code: "ja", name: "Japanese", nativeName: "日本語", dir: "ltr", region: "日本 (Japan)" },
  { code: "zh", name: "Chinese (Simplified)", nativeName: "简体中文", dir: "ltr", region: "中国 (China)" },
  { code: "pt", name: "Portuguese", nativeName: "Português", dir: "ltr", region: "Brasil / Portugal" },
  { code: "ar", name: "Arabic", nativeName: "العربية", dir: "rtl", region: "الشرق الأوسط (MENA)" },
];

export const translations = {
  en: {
    // Navigation
    overview: "Overview",
    projects: "Projects",
    taskOperations: "Task Operations",
    assetLibrary: "Asset & File Library",
    teamRoster: "Team Roster",
    auditStream: "Audit Stream",
    settings: "Settings",
    workspaceModules: "Workspace Modules",
    addTask: "+ Task",
    addProject: "+ Project",
    online: "ONLINE",
    systemNode: "OPSPULSE-NODE-01",

    // Header & Account
    workspaceOps: "WORKSPACE-OPS",
    myAssignedTasks: "MY ASSIGNED TASKS",
    manageTeamRoster: "MANAGE TEAM ROSTER",
    signOut: "SIGN OUT",
    roleAdmin: "ADMIN",
    roleManager: "MANAGER",
    roleMember: "MEMBER",
    selectLanguage: "SELECT LANGUAGE",
    language: "Language",

    // Auth & Login
    loginTitle: "OpsPulse",
    loginSubtitle: "INTERNAL ENTERPRISE OPERATIONS CONSOLE",
    authCardHeader: "AUTHENTICATE WORKSPACE SESSION",
    authCardDescription: "Enter enterprise credentials to access operational resources.",
    workEmail: "WORK EMAIL",
    password: "PASSWORD",
    enterWorkspace: "ENTER WORKSPACE",
    verifyingSession: "VERIFYING SESSION...",
    testPresets: "TEST CREDENTIAL PRESETS",
    leadRole: "Eleanor (Lead)",
    tpmRole: "Marcus (TPM)",
    engRole: "Sarah (Eng)",
    footerNodeText: "OPSPULSE CORE // SYSTEM NODE #4829 // AUDIT STREAM ACTIVE",
    invalidCredentials: "Invalid work email or password.",

    // Common Actions & Badges
    search: "Search...",
    filter: "Filter",
    all: "All",
    cancel: "Cancel",
    save: "Save Changes",
    edit: "Edit",
    delete: "Delete",
    create: "Create",
    export: "Export",
    upload: "Upload",
    download: "Download",
    loading: "Loading...",
    status: "Status",
    priority: "Priority",
    actions: "Actions",

    // Statuses
    statusTodo: "To Do",
    statusInProgress: "In Progress",
    statusInReview: "In Review",
    statusDone: "Done",

    // Priorities
    priorityLow: "Low",
    priorityMedium: "Medium",
    priorityHigh: "High",
    priorityCritical: "Critical",

    // Dashboard & Widgets
    quickActions: "Quick Actions",
    activeProjects: "Active Projects",
    totalTasks: "Total Tasks",
    completedTasks: "Completed Tasks",
    teamMembers: "Team Members",
  },
  es: {
    // Navigation
    overview: "Resumen",
    projects: "Proyectos",
    taskOperations: "Operaciones de Tareas",
    assetLibrary: "Biblioteca de Archivos",
    teamRoster: "Plantilla de Equipo",
    auditStream: "Registro de Auditoría",
    settings: "Configuración",
    workspaceModules: "Módulos del Espacio",
    addTask: "+ Tarea",
    addProject: "+ Proyecto",
    online: "EN LÍNEA",
    systemNode: "OPSPULSE-NODO-01",

    // Header & Account
    workspaceOps: "OPERACIONES-ESPACIO",
    myAssignedTasks: "MIS TAREAS ASIGNADAS",
    manageTeamRoster: "GESTIONAR EQUIPO",
    signOut: "CERRAR SESIÓN",
    roleAdmin: "ADMINISTRADOR",
    roleManager: "GERENTE",
    roleMember: "MIEMBRO",
    selectLanguage: "SELECCIONAR IDIOMA",
    language: "Idioma",

    // Auth & Login
    loginTitle: "OpsPulse",
    loginSubtitle: "CONSOLA DE OPERACIONES EMPRESARIALES",
    authCardHeader: "AUTENTICAR SESIÓN DE ESPACIO",
    authCardDescription: "Ingrese credenciales empresariales para acceder a recursos.",
    workEmail: "CORREO LABORAL",
    password: "CONTRASEÑA",
    enterWorkspace: "ACCEDER AL ESPACIO",
    verifyingSession: "VERIFICANDO SESIÓN...",
    testPresets: "CREDENCIALES DE PRUEBA",
    leadRole: "Eleanor (Líder)",
    tpmRole: "Marcus (TPM)",
    engRole: "Sarah (Ing)",
    footerNodeText: "OPSPULSE CORE // NODO DE SISTEMA #4829 // AUDITORÍA ACTIVA",
    invalidCredentials: "Correo laboral o contraseña inválidos.",

    // Common Actions & Badges
    search: "Buscar...",
    filter: "Filtrar",
    all: "Todos",
    cancel: "Cancelar",
    save: "Guardar Cambios",
    edit: "Editar",
    delete: "Eliminar",
    create: "Crear",
    export: "Exportar",
    upload: "Subir",
    download: "Descargar",
    loading: "Cargando...",
    status: "Estado",
    priority: "Prioridad",
    actions: "Acciones",

    // Statuses
    statusTodo: "Por Hacer",
    statusInProgress: "En Progreso",
    statusInReview: "En Revisión",
    statusDone: "Completado",

    // Priorities
    priorityLow: "Baja",
    priorityMedium: "Media",
    priorityHigh: "Alta",
    priorityCritical: "Crítica",

    // Dashboard & Widgets
    quickActions: "Acciones Rápidas",
    activeProjects: "Proyectos Activos",
    totalTasks: "Tareas Totales",
    completedTasks: "Tareas Completadas",
    teamMembers: "Miembros del Equipo",
  },
  fr: {
    // Navigation
    overview: "Vue d'ensemble",
    projects: "Projets",
    taskOperations: "Opérations des Tâches",
    assetLibrary: "Bibliothèque de Fichiers",
    teamRoster: "Effectif de l'Équipe",
    auditStream: "Journal d'Audit",
    settings: "Paramètres",
    workspaceModules: "Modules de Travail",
    addTask: "+ Tâche",
    addProject: "+ Projet",
    online: "EN LIGNE",
    systemNode: "OPSPULSE-NOEUD-01",

    // Header & Account
    workspaceOps: "ESPACE-OPS",
    myAssignedTasks: "MES TÂCHES ATTRIBUÉES",
    manageTeamRoster: "GÉRER L'ÉQUIPE",
    signOut: "DÉCONNEXION",
    roleAdmin: "ADMIN",
    roleManager: "RESPONSABLE",
    roleMember: "MEMBRE",
    selectLanguage: "CHOISIR LA LANGUE",
    language: "Langue",

    // Auth & Login
    loginTitle: "OpsPulse",
    loginSubtitle: "CONSOLE D'OPÉRATIONS D'ENTREPRISE INTERNE",
    authCardHeader: "AUTHENTIFIER LA SESSION",
    authCardDescription: "Saisissez vos identifiants d'entreprise pour accéder.",
    workEmail: "EMAIL PROFESSIONNEL",
    password: "MOT DE PASSE",
    enterWorkspace: "ACCÉDER À L'ESPACE",
    verifyingSession: "VÉRIFICATION DE SESSION...",
    testPresets: "IDENTIFIANTS DE TEST",
    leadRole: "Eleanor (Chef)",
    tpmRole: "Marcus (TPM)",
    engRole: "Sarah (Ingénieur)",
    footerNodeText: "OPSPULSE CORE // NOEUD SYSTÈME #4829 // AUDIT ACTIF",
    invalidCredentials: "Email ou mot de passe invalide.",

    // Common Actions & Badges
    search: "Rechercher...",
    filter: "Filtrer",
    all: "Tous",
    cancel: "Annuler",
    save: "Enregistrer",
    edit: "Modifier",
    delete: "Supprimer",
    create: "Créer",
    export: "Exporter",
    upload: "Téléverser",
    download: "Télécharger",
    loading: "Chargement...",
    status: "Statut",
    priority: "Priorité",
    actions: "Actions",

    // Statuses
    statusTodo: "À faire",
    statusInProgress: "En cours",
    statusInReview: "En révision",
    statusDone: "Terminé",

    // Priorities
    priorityLow: "Basse",
    priorityMedium: "Moyenne",
    priorityHigh: "Haute",
    priorityCritical: "Critique",

    // Dashboard & Widgets
    quickActions: "Actions Rapides",
    activeProjects: "Projets Actifs",
    totalTasks: "Tâches Totales",
    completedTasks: "Tâches Terminées",
    teamMembers: "Membres de l'Équipe",
  },
  de: {
    // Navigation
    overview: "Übersicht",
    projects: "Projekte",
    taskOperations: "Aufgabenverwaltung",
    assetLibrary: "Datei- und Medienbibliothek",
    teamRoster: "Team-Dienstplan",
    auditStream: "Audit-Protokoll",
    settings: "Einstellungen",
    workspaceModules: "Arbeitsbereich-Module",
    addTask: "+ Aufgabe",
    addProject: "+ Projekt",
    online: "ONLINE",
    systemNode: "OPSPULSE-KNOTEN-01",

    // Header & Account
    workspaceOps: "ARBEITSBEREICH-OPS",
    myAssignedTasks: "MEINE ZUGEWIESENEN AUFGABEN",
    manageTeamRoster: "TEAMPLAN VERWALTEN",
    signOut: "ABMELDEN",
    roleAdmin: "ADMIN",
    roleManager: "MANAGER",
    roleMember: "MITGLIED",
    selectLanguage: "SPRACHE WÄHLEN",
    language: "Sprache",

    // Auth & Login
    loginTitle: "OpsPulse",
    loginSubtitle: "INTERNE BETRIEBSKONSOLE",
    authCardHeader: "SITZUNG AUTHENTIFIZIEREN",
    authCardDescription: "Geben Sie Ihre Zugangsdaten ein, um fortzufahren.",
    workEmail: "DIENSTLICHE E-MAIL",
    password: "PASSWORT",
    enterWorkspace: "ARBEITSBEREICH ÖFFNEN",
    verifyingSession: "SITZUNG WIRD GEPRÜFT...",
    testPresets: "TEST-ZUGANGSDATEN",
    leadRole: "Eleanor (Leitung)",
    tpmRole: "Marcus (TPM)",
    engRole: "Sarah (Entwicklerin)",
    footerNodeText: "OPSPULSE CORE // SYSTEMKNOTEN #4829 // AUDIT AKTIV",
    invalidCredentials: "Ungültige E-Mail-Adresse oder falsches Passwort.",

    // Common Actions & Badges
    search: "Suchen...",
    filter: "Filtern",
    all: "Alle",
    cancel: "Abbrechen",
    save: "Änderungen speichern",
    edit: "Bearbeiten",
    delete: "Löschen",
    create: "Erstellen",
    export: "Exportieren",
    upload: "Hochladen",
    download: "Herunterladen",
    loading: "Wird geladen...",
    status: "Status",
    priority: "Priorität",
    actions: "Aktionen",

    // Statuses
    statusTodo: "Zu erledigen",
    statusInProgress: "In Bearbeitung",
    statusInReview: "In Überprüfung",
    statusDone: "Erledigt",

    // Priorities
    priorityLow: "Niedrig",
    priorityMedium: "Mittel",
    priorityHigh: "Hoch",
    priorityCritical: "Kritisch",

    // Dashboard & Widgets
    quickActions: "Schnellaktionen",
    activeProjects: "Aktive Projekte",
    totalTasks: "Aufgaben Gesamt",
    completedTasks: "Abgeschlossene Aufgaben",
    teamMembers: "Teammitglieder",
  },
  ja: {
    // Navigation
    overview: "概要",
    projects: "プロジェクト",
    taskOperations: "タスク管理",
    assetLibrary: "アセット・ファイル",
    teamRoster: "チーム名簿",
    auditStream: "監査ログ",
    settings: "設定",
    workspaceModules: "ワークスペース モジュール",
    addTask: "+ タスク作成",
    addProject: "+ プロジェクト作成",
    online: "オンライン",
    systemNode: "OPSPULSE-NODE-01",

    // Header & Account
    workspaceOps: "ワークスペース運用",
    myAssignedTasks: "担当タスク一覧",
    manageTeamRoster: "チーム名簿管理",
    signOut: "サインアウト",
    roleAdmin: "管理者",
    roleManager: "マネージャー",
    roleMember: "メンバー",
    selectLanguage: "言語を選択",
    language: "言語",

    // Auth & Login
    loginTitle: "OpsPulse",
    loginSubtitle: "社内業務統合オペレーションコンソール",
    authCardHeader: "ワークスペース認証",
    authCardDescription: "業務リソースにアクセスするために認証情報を入力してください。",
    workEmail: "社内メールアドレス",
    password: "パスワード",
    enterWorkspace: "コンソールへログイン",
    verifyingSession: "セッション検証中...",
    testPresets: "テスト用アカウントプリセット",
    leadRole: "Eleanor (リード)",
    tpmRole: "Marcus (TPM)",
    engRole: "Sarah (エンジニア)",
    footerNodeText: "OPSPULSE CORE // システムノード #4829 // 監査稼働中",
    invalidCredentials: "メールアドレスまたはパスワードが正しくありません。",

    // Common Actions & Badges
    search: "検索...",
    filter: "絞り込み",
    all: "すべて",
    cancel: "キャンセル",
    save: "変更を保存",
    edit: "編集",
    delete: "削除",
    create: "新規作成",
    export: "エクスポート",
    upload: "アップロード",
    download: "ダウンロード",
    loading: "読み込み中...",
    status: "ステータス",
    priority: "優先度",
    actions: "操作",

    // Statuses
    statusTodo: "未着手",
    statusInProgress: "進行中",
    statusInReview: "レビュー中",
    statusDone: "完了",

    // Priorities
    priorityLow: "低",
    priorityMedium: "中",
    priorityHigh: "高",
    priorityCritical: "緊急",

    // Dashboard & Widgets
    quickActions: "クイック操作",
    activeProjects: "進行中プロジェクト",
    totalTasks: "総タスク数",
    completedTasks: "完了済みタスク",
    teamMembers: "チームメンバー",
  },
  zh: {
    // Navigation
    overview: "概览",
    projects: "项目管理",
    taskOperations: "任务中心",
    assetLibrary: "资产与文档库",
    teamRoster: "团队花名册",
    auditStream: "审计流水",
    settings: "系统设置",
    workspaceModules: "工作区模块",
    addTask: "+ 新建任务",
    addProject: "+ 新建项目",
    online: "在线",
    systemNode: "OPSPULSE-节点-01",

    // Header & Account
    workspaceOps: "工作区运维",
    myAssignedTasks: "我的指派任务",
    manageTeamRoster: "管理团队花名册",
    signOut: "退出登录",
    roleAdmin: "超级管理",
    roleManager: "主管经理",
    roleMember: "团队成员",
    selectLanguage: "选择语言",
    language: "语言",

    // Auth & Login
    loginTitle: "OpsPulse",
    loginSubtitle: "企业内部运营协作控制台",
    authCardHeader: "验证工作区会话",
    authCardDescription: "请输入企业账户凭据以访问内部运维资源。",
    workEmail: "企业工作邮箱",
    password: "账户密码",
    enterWorkspace: "进入工作区",
    verifyingSession: "正在验证会话...",
    testPresets: "测试账号快捷填充",
    leadRole: "Eleanor (负责人)",
    tpmRole: "Marcus (项目经理)",
    engRole: "Sarah (工程师)",
    footerNodeText: "OPSPULSE 核心架构 // 系统节点 #4829 // 实时审计中",
    invalidCredentials: "工作邮箱或密码不正确。",

    // Common Actions & Badges
    search: "搜索...",
    filter: "筛选",
    all: "全部",
    cancel: "取消",
    save: "保存更改",
    edit: "编辑",
    delete: "删除",
    create: "创建",
    export: "导出",
    upload: "上传",
    download: "下载",
    loading: "加载中...",
    status: "状态",
    priority: "优先级",
    actions: "操作",

    // Statuses
    statusTodo: "待处理",
    statusInProgress: "进行中",
    statusInReview: "审核中",
    statusDone: "已完成",

    // Priorities
    priorityLow: "低",
    priorityMedium: "中",
    priorityHigh: "高",
    priorityCritical: "严重",

    // Dashboard & Widgets
    quickActions: "快捷操作",
    activeProjects: "活跃项目",
    totalTasks: "任务总数",
    completedTasks: "已完成任务",
    teamMembers: "团队成员",
  },
  pt: {
    // Navigation
    overview: "Visão Geral",
    projects: "Projetos",
    taskOperations: "Operações de Tarefas",
    assetLibrary: "Biblioteca de Arquivos",
    teamRoster: "Equipe",
    auditStream: "Registro de Auditoria",
    settings: "Configurações",
    workspaceModules: "Módulos do Workspace",
    addTask: "+ Tarefa",
    addProject: "+ Projeto",
    online: "ONLINE",
    systemNode: "OPSPULSE-NÓ-01",

    // Header & Account
    workspaceOps: "OPERAÇÕES-WORKSPACE",
    myAssignedTasks: "MINHAS TAREFAS",
    manageTeamRoster: "GERENCIAR EQUIPE",
    signOut: "SAIR",
    roleAdmin: "ADMIN",
    roleManager: "GERENTE",
    roleMember: "MEMBRO",
    selectLanguage: "SELECIONAR IDIOMA",
    language: "Idioma",

    // Auth & Login
    loginTitle: "OpsPulse",
    loginSubtitle: "CONSOLE DE OPERAÇÕES EMPRESARIAIS INTERNO",
    authCardHeader: "AUTENTICAR SESSÃO",
    authCardDescription: "Insira credenciais empresariais para acessar os recursos.",
    workEmail: "E-MAIL CORPORATIVO",
    password: "SENHA",
    enterWorkspace: "ACESSAR WORKSPACE",
    verifyingSession: "VERIFICANDO SESSÃO...",
    testPresets: "CREDENCIAIS DE TESTE",
    leadRole: "Eleanor (Líder)",
    tpmRole: "Marcus (TPM)",
    engRole: "Sarah (Eng)",
    footerNodeText: "OPSPULSE CORE // NÓ DE SISTEMA #4829 // AUDITORIA ATIVA",
    invalidCredentials: "E-mail de trabalho ou senha inválidos.",

    // Common Actions & Badges
    search: "Pesquisar...",
    filter: "Filtrar",
    all: "Todos",
    cancel: "Cancelar",
    save: "Salvar Alterações",
    edit: "Editar",
    delete: "Excluir",
    create: "Criar",
    export: "Exportar",
    upload: "Enviar",
    download: "Baixar",
    loading: "Carregando...",
    status: "Status",
    priority: "Prioridade",
    actions: "Ações",

    // Statuses
    statusTodo: "A Fazer",
    statusInProgress: "Em Andamento",
    statusInReview: "Em Revisão",
    statusDone: "Concluído",

    // Priorities
    priorityLow: "Baixa",
    priorityMedium: "Média",
    priorityHigh: "Alta",
    priorityCritical: "Crítica",

    // Dashboard & Widgets
    quickActions: "Ações Rápidas",
    activeProjects: "Projetos Ativos",
    totalTasks: "Total de Tarefas",
    completedTasks: "Tarefas Concluídas",
    teamMembers: "Membros da Equipe",
  },
  ar: {
    // Navigation
    overview: "نظرة عامة",
    projects: "المشاريع",
    taskOperations: "عمليات المهام",
    assetLibrary: "مكتبة الملفات والموارد",
    teamRoster: "فريق العمل",
    auditStream: "سجل التدقيق",
    settings: "الإعدادات",
    workspaceModules: "وحدات مساحة العمل",
    addTask: "+ مهمة",
    addProject: "+ مشروع",
    online: "متصل",
    systemNode: "OPSPULSE-NODE-01",

    // Header & Account
    workspaceOps: "عمليات-المساحة",
    myAssignedTasks: "مهامي المعينة",
    manageTeamRoster: "إدارة فريق العمل",
    signOut: "تسجيل الخروج",
    roleAdmin: "مدير عام",
    roleManager: "مدير",
    roleMember: "عضو",
    selectLanguage: "اختر اللغة",
    language: "اللغة",

    // Auth & Login
    loginTitle: "OpsPulse",
    loginSubtitle: "لوحة التحكم في العمليات التشغيلية للمؤسسة",
    authCardHeader: "تسجيل الدخول لمساحة العمل",
    authCardDescription: "أدخل بيانات الاعتماد المؤسسية للوصول للموارد.",
    workEmail: "البريد الإلكتروني للعمل",
    password: "كلمة المرور",
    enterWorkspace: "دخول مساحة العمل",
    verifyingSession: "جارٍ التحقق من الجلسة...",
    testPresets: "حسابات تجريبية سريعة",
    leadRole: "إليانور (قائدة الفريق)",
    tpmRole: "ماركوس (مدير المشروع)",
    engRole: "سارة (مهندسة)",
    footerNodeText: "نواة OPSPULSE // عقدة النظام #4829 // سجل التدقيق نشط",
    invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",

    // Common Actions & Badges
    search: "بحث...",
    filter: "تصفية",
    all: "الكل",
    cancel: "إلغاء",
    save: "حفظ التغييرات",
    edit: "تعديل",
    delete: "حذف",
    create: "إنشاء",
    export: "تصدير",
    upload: "رفع",
    download: "تحميل",
    loading: "جارٍ التحميل...",
    status: "الحالة",
    priority: "الأولوية",
    actions: "الإجراءات",

    // Statuses
    statusTodo: "قيد الانتظار",
    statusInProgress: "قيد التنفيذ",
    statusInReview: "قيد المراجعة",
    statusDone: "مكتمل",

    // Priorities
    priorityLow: "منخفضة",
    priorityMedium: "متوسطة",
    priorityHigh: "عالية",
    priorityCritical: "حرجة",

    // Dashboard & Widgets
    quickActions: "إجراءات سريعة",
    activeProjects: "المشاريع النشطة",
    totalTasks: "إجمالي المهام",
    completedTasks: "المهام المكتملة",
    teamMembers: "أعضاء الفريق",
  },
};

export type TranslationKey = keyof typeof translations.en;
