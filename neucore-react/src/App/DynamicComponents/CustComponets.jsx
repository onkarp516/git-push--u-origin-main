import React, { Suspense } from "react";
import Page1 from "@/Pages/Page1";
import SchoolCatlog from "@/Pages/SchoolCatlog/SchoolCatlog";
import Catlog from "@/Pages/Catlog/Catlog";

import Page2 from "@/Pages/Page2";

import Login from "@/Pages/Login/Login";
import FeesHead from "@/Pages/Fees/Feeshead";
import FeesSubHead from "@/Pages/Fees/FeesSubHead";
import FeesInstallmentEdit from "@/Pages/Fees/FeesInstallmentEdit";
import TranxSalesInvoiceDetails from "../../Pages/Tranx/Sales/Invoice/TranxSaleInvoiceDetails";

const Dashboard = React.lazy(() => import("@/Pages/Dashboard/Dashboard"));

const Company = React.lazy(() => import("@/Pages/Company/Company"));
const CompanyUser = React.lazy(() => import("@/Pages/Company/CompanyUser"));
const Outlet = React.lazy(() => import("@/Pages/Outlet/Outlet"));
const OutletUser = React.lazy(() => import("@/Pages/Outlet/OutletUser"));
const Religion = React.lazy(() => import("@/Pages/Religion/Religion"));
const Bus = React.lazy(() => import("@/Pages/Bus/Bus"));
const ScholarShip = React.lazy(() => import("@/Pages/ScholarShip/ScholarShip"));

const Caste = React.lazy(() => import("@/Pages/Caste/Caste"));
const SubCaste = React.lazy(() => import("@/Pages/SubCaste/SubCaste"));
const FeesMaster = React.lazy(() => import("@/Pages/Fees/FeesMaster"));
const FeesMasterEdit = React.lazy(() => import("@/Pages/Fees/FeesMasterEdit"));
const FeesMasterList = React.lazy(() => import("@/Pages/Fees/FeesMasterList"));
const FeesInstallment = React.lazy(() =>
  import("@/Pages/Fees/FeesInstallment")
);
const FeesInstallmentList = React.lazy(() =>
  import("@/Pages/Fees/FeesInstallmentList")
);
const StudentFeesPayment = React.lazy(() =>
  import("@/Pages/Transaction/StudentFeesPayment")
);
const StudentCopy = React.lazy(() => import("@/Pages/Transaction/StudentCopy"));
const StudentCopyData = React.lazy(() =>
  import("@/Pages/Transaction/StudentCopyData")
);
const StudentCopyDataStructure = React.lazy(() =>
  import("@/Pages/Transaction/StudentCopyDataStructure")
);
const StudentCopyBlank = React.lazy(() =>
  import("@/Pages/Transaction/StudentCopyBlank")
);
const Bonafide = React.lazy(() => import("@/Pages/Transaction/Bonafide"));
const Bonafide_data = React.lazy(() =>
  import("@/Pages/Transaction/Bonafide_data")
);
const Bonafide_offset = React.lazy(() =>
  import("@/Pages/Transaction/Bonafide_offset")
);

const Lc = React.lazy(() => import("@/Pages/Transaction/Lc"));
const StudentList = React.lazy(() => import("@/Pages/Student/StudentList"));
const StudentPaymentList = React.lazy(() =>
  import("@/Pages/Transaction/StudentPaymentList")
);
const StudentAdmission = React.lazy(() =>
  import("@/Pages/Student/StudentAdmission")
);
const StudentAdmissionEdit = React.lazy(() =>
  import("@/Pages/Student/StudentAdmissionEdit")
);
const StudentPromotion = React.lazy(() =>
  import("@/Pages/Student/StudentPromotion")
);
const StudentPromotionList = React.lazy(() =>
  import("@/Pages/Student/StudentPromotionList")
);
const StudentBus = React.lazy(() => import("@/Pages/Student/StudentBus"));

const StudentBusList = React.lazy(() =>
  import("@/Pages/Student/StudentBusList")
);

const StudentScholarShipList = React.lazy(() =>
  import("@/Pages/Student/StudentScholarShipList")
);

const StudentScholarShip = React.lazy(() =>
  import("@/Pages/Student/StudentScholarShip")
);

const CasteCategory = React.lazy(() =>
  import("@/Pages/CasteCategory/CasteCategory")
);
const OutstandingList = React.lazy(() =>
  import("@/Pages/Report/OutstandingList")
);

const DailyCollection = React.lazy(() =>
  import("@/Pages/Report/DailyCollection")
);

//const Feeshead = React.lazy(() => import("@/Pages/FeesHead/Feeshead"));
const AcademicYear = React.lazy(() =>
  import("@/Pages/SchoolCatlog/AcademicYear/AcademicYear")
);
const Division = React.lazy(() =>
  import("@/Pages/SchoolCatlog/Division/Division")
);
const Standard = React.lazy(() =>
  import("@/Pages/SchoolCatlog/Standard/Standard")
);
// const Division = React.lazy(() => import("@/Pages/SchoolCatlog/Division/Division"));

const MotherTongue = React.lazy(() =>
  import("@/Pages/MotherTongue/MotherTongue")
);
// import CompanyUser from '@render/pages/Company/CompanyUser';
const Unit = React.lazy(() => import("@/Pages/Unit/Unit"));
const HSN = React.lazy(() => import("@/Pages/HSN/HSN"));
const Tax = React.lazy(() => import("@/Pages/Tax/Tax"));

const AssociateGroup = React.lazy(() =>
  import("@/Pages/AssociateGroup/AssociateGroup")
);
const LedgerList = React.lazy(() => import("@/Pages/Ledger/LedgerList"));
const LedgerCreate = React.lazy(() => import("@/Pages/Ledger/LedgerCreate"));
const LedgerEdit = React.lazy(() => import("@/Pages/Ledger/LedgerEdit"));
const LedgerDetails = React.lazy(() => import("@/Pages/Ledger/LedgerDetails"));
const LedgerVoucherDetails = React.lazy(() =>
  import("@/Pages/Ledger/LedgerVoucherDetails")
);
const ProductList = React.lazy(() => import("@/Pages/Product/ProductList"));
const ProductCreate = React.lazy(() => import("@/Pages/Product/ProductCreate"));
const ProductEdit = React.lazy(() => import("@/Pages/Product/ProductEdit"));
const TranxSaleInvoiceList = React.lazy(() =>
  import("@/Pages/Tranx/Sales/Invoice/TranxSaleInvoiceList")
);

// Profit & Loss
const ProfitBalance = React.lazy(() =>
  import("@/Pages/ProfitAndLoss/ProfitBalance")
);
const ProfitAndLoss1 = React.lazy(() =>
  import("@/Pages/ProfitAndLoss/ProfitAndLoss1")
);
const ProfitAndLoss2 = React.lazy(() =>
  import("@/Pages/ProfitAndLoss/ProfitAndLoss2")
);
const ProfitAndLoss3 = React.lazy(() =>
  import("@/Pages/ProfitAndLoss/ProfitAndLoss3")
);

const ContraList = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Contra/ContraList")
);
const Contra = React.lazy(() => import("@/Pages/Tranx/Vouchers/Contra/Contra"));
const VoucherCreditList = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Credit/VoucherCreditList")
);
const VoucherCreditNote = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Credit/VoucherCreditNote")
);
const VoucherDebitList = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Debit/VoucherDebitList")
);
const VoucherDebitNote = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Debit/VoucherDebitNote")
);
// const TranxDebitNoteList = React.lazy(() =>
//   import("@/Pages/Tranx/Purchase/Debit_Note/TranxDebitNoteList")
// );
const ReceiptList = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Receipt/ReceiptList")
);
const ReceiptDetails = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Receipt/ReceiptDetails")
);
const Receipt = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Receipt/Receipt")
);

const PaymentList = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Payment/PaymentList")
);
const Payment = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Payment/Payment")
);
const Journal = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Journal/Journal")
);
const JournalList = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Journal/JournalList")
);
const JournalDetails = React.lazy(() =>
  import("@/Pages/Tranx/Vouchers/Journal/JournalDetails")
);
// ! User Management
const UserMgntList = React.lazy(() =>
  import("@/Pages/UserManagement/UserList")
);

const UserMgntCreate = React.lazy(() =>
  import("@/Pages/UserManagement/UserCreate")
);

const MstActions = React.lazy(() =>
  import("@/Pages/UserManagement/MstActions")
);
const MstModules = React.lazy(() =>
  import("@/Pages/UserManagement/MstModules")
);
const MstModuleMapping = React.lazy(() =>
  import("@/Pages/UserManagement/MstModuleMapping")
);

// ! User Management

const Components = {
  page1: Page1,
  catlog: Catlog,
  schoolcatlog: SchoolCatlog,
  page2: Page2,
  login: Login,
  dashboard: Dashboard,
  company: Company,
  companyuser: CompanyUser,
  outlet: Outlet,
  outletuser: OutletUser,
  academicyear: AcademicYear,
  standard: Standard,
  division: Division,

  /**************************** schools master          *********************************/
  mothertongue: MotherTongue,
  religion: Religion,
  bus: Bus,
  scholarship: ScholarShip,
  caste: Caste,
  subcaste: SubCaste,
  castecategory: CasteCategory,
  feeshead: FeesHead,
  feessubhead: FeesSubHead,
  feesmaster: FeesMaster,
  feesmasteredit: FeesMasterEdit,
  feesmasterlist: FeesMasterList,
  feesinstallment: FeesInstallment,
  feesinstallmentList: FeesInstallmentList,
  feesinstallmentedit: FeesInstallmentEdit,
  studentfeespayment: StudentFeesPayment,
  studentcopy: StudentCopyData,
  studentcopyonlydata: StudentCopy,
  studentcopywithstructure: StudentCopyDataStructure,
  studentcopyblank: StudentCopyBlank,

  bonafide: Bonafide,
  bonafide_data: Bonafide_data,
  bonafide_offset: Bonafide_offset,
  lc: Lc,
  outstandinglist: OutstandingList,
  dailycollection: DailyCollection,
  studentadmission: StudentAdmission,
  studentadmissionedit: StudentAdmissionEdit,
  studentList: StudentList,
  studentPaymentList: StudentPaymentList,
  studentpromotion: StudentPromotion,
  studentpromotionlist: StudentPromotionList,
  studentbus: StudentBus,
  studentbuslist: StudentBusList,
  studentscholarshiplist: StudentScholarShipList,
  studentscholarship: StudentScholarShip,
  unit: Unit,
  hsn: HSN,
  associategroup: AssociateGroup,
  ledgerlist: LedgerList,
  ledgercreate: LedgerCreate,
  ledgeredit: LedgerEdit,
  ledgerdetails: LedgerDetails,
  ledgervoucherdetails: LedgerVoucherDetails,
  productlist: ProductList,
  productcreate: ProductCreate,
  productedit: ProductEdit,
  tax: Tax,
  tranx_sales_invoice_list: TranxSaleInvoiceList,
  salesinvoicedetail: TranxSalesInvoiceDetails,

  /*******************Tranx Vouchers start*********************/
  tranx_contra_List: ContraList,
  tranx_contra: Contra,
  voucher_credit_List: VoucherCreditList,
  voucher_credit_note: VoucherCreditNote,
  voucher_debit_note_List: VoucherDebitList,
  voucher_debit_note: VoucherDebitNote,
  voucher_receipt_list: ReceiptList,
  voucher_receipt_details: ReceiptDetails,
  voucher_receipt: Receipt,
  voucher_paymentlist: PaymentList,
  voucher_payment: Payment,
  voucher_journal_list: JournalList,
  voucher_journal_details: JournalDetails,
  voucher_journal: Journal,
  profitbalance: ProfitBalance,
  profitandloss1: ProfitAndLoss1,
  profitandloss2: ProfitAndLoss2,
  profitandloss3: ProfitAndLoss3,

  //! /*! UserMgntList */

  user_mgnt_list: UserMgntList,
  user_mgnt_create: UserMgntCreate,
  user_mgnt_mst_actions: MstActions,
  user_mgnt_mst_modules: MstModules,
  user_mgnt_mst_module_mapping: MstModuleMapping,
  //! /*! UserMgntList */
};

export default function CustComponets(block) {
  if (typeof Components[block.component] !== "undefined") {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        {React.createElement(Components[block.component], {
          key: block._uid,
          block: block,
        })}
      </Suspense>
    );
  }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {React.createElement(
        () => (
          <div>The component {block.component} has not been created yet.</div>
        ),
        { key: block._uid }
      )}
    </Suspense>
  );
}
