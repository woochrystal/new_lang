/**
 * Component Index - HTML5 래핑 컴포넌트 통합 export
 *
 * 시맨틱 HTML5 태그들을 React 컴포넌트로 래핑한 것들입니다.
 * 모든 HTML 네이티브 props를 지원하며, React 19 자동 ref 지원합니다.
 *
 * @example
 * import { A, Label, Hr, Section, Article, Form, Ul, Li, Table } from '@/shared/component';
 */

// Typography (Link)
export { A } from './typography/A';

// Tables
export { default as Table } from './table/Table';
export { default as Thead } from './table/Thead';
export { default as Tbody } from './table/Tbody';
export { default as Tfoot } from './table/Tfoot';
export { default as Tr } from './table/Tr';
export { default as Th } from './table/Th';
export { default as Td } from './table/Td';
export { default as Caption } from './table/Caption';
export { default as DataTable } from './table/DataTable';

// Form Elements
export { default as Search } from './form/Search';
export { default as Label } from './input/Label';

// Semantic Containers
export { default as Section } from './container/Section';
export { Article } from './container/Article';
export { default as Header } from './container/Header';
export { default as Footer } from './container/Footer';
export { Main } from './container/Main';
export { default as Nav } from './container/Nav';
export { default as Aside } from './container/Aside';

// Lists
export { default as Ul } from './list/Ul';
export { default as Ol } from './list/Ol';
export { default as Li } from './list/Li';

// Layout
export { default as Content } from './layout/Content';
export { default as ContentLayout } from './layout/ContentLayout';
export { default as ContentMainLayout } from './layout/ContentMainLayout';

// ErrorPage
export { AccessDenied } from './errorpage/AccessDenied';
export { default as Error } from './errorpage/Error';
export { default as GlobalError } from './errorpage/GlobalError';
export { default as NotFound } from './errorpage/NotFound';
export { ErrorState } from './errorpage/ErrorState';
export { EmptyState } from './errorpage/EmptyState';
export { BlockingError } from './errorpage/BlockingError';
export { GlobalBlockingError } from './errorpage/GlobalBlockingError';
export { default as ErrorBoundary } from './errorpage/ErrorBoundary';

// Guards
export { default as RouteGuard } from './guards/RouteGuard';
export { default as RenderGuard } from './guards/RenderGuard';
export { TenantGuard } from './guards/TenantGuard';
export { default as HydrationGuard } from './guards/HydrationGuard';

// Popup
export { default as Alert } from './popup/Alert';
export { default as Drawer } from './popup/Drawer';
export { default as Modal } from './popup/Modal';
export { default as GlobalErrorAlert } from './popup/GlobalErrorAlert';

// Loading
export { Loading } from './loading/Loading';

// Button
export { default as Button } from './button/Button';

// Input Components
export { default as Input } from './input/Input';
export { default as FileUpload } from './fileupload/FileUpload';
export { default as Textarea } from './input/Textarea';
export { default as Select } from './input/Select';
export { default as Checkbox } from './input/Checkbox';
export { default as CheckboxGroup } from './input/CheckboxGroup';
export { default as Radio } from './input/Radio';
export { default as RadioGroup } from './input/RadioGroup';
export { default as RadioButton } from './input/RadioButton';
export { default as RadioCircle } from './input/RadioCircle';
export { default as Datepicker } from './datepicker/Datepicker';
export { default as DatepickerPeriod } from './datepicker/DatepickerPeriod';

// Pagination
export { default as Pagination } from './pagination/Pagination';

// Divider
export { default as Hr } from './divider/Hr';

// Approval
export { default as ApprovalStatus } from './approval/ApprovalStatus';

// Title
export { default as Title } from './title/Title';

// Tab (Compound Pattern)
export { default as Tab } from './tab/Tab';

// Tag
export { default as Tag } from './tag/Tag';

// Editor
export { default as Editor } from './editor/Editor';

// Tree
export { default as Tree } from './tree/Tree';

// DevMode
export { default as DevModeAlert } from './devmode/DevModeAlert';

// Menu
export { default as LeftMenu } from './menu/LeftMenu';
export { default as MenuItem } from './menu/MenuItem';

// Session
export { SessionRevalidation } from './session/SessionRevalidation';
