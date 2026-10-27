import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import type { SiteSettingsGeneral, SiteSettingsHome, SiteSettingsSeo, SiteSettingsCompany, SiteSettingsContact, SiteSettingsNews, SiteSettingsCases, SiteSettingsProperties, SiteSettingsServices, SiteSettingsCategories } from "../../types/content";

export const DEFAULT_GENERAL: SiteSettingsGeneral = {
  companyNameZh: "株式会社イエローハウスカンパニー\n(YELLOW HOUSE COMPANY)",
  companyNameEn: "Yellow House Company Inc.\n(株式会社イエローハウスカンパニー)",
  companyNameJp: "株式会社イエローハウスカンパニー",
  licenseZh: "神奈川縣知事（1）第32070號",
  licenseEn: "Governor of Kanagawa (1) No. 32070",
  licenseJp: "神奈川県知事（1）第32070号",
  addressZh: "神奈川縣伊勢原市櫻台1-22-15\nネオハイツ伊勢原112 (〒259-1132)",
  addressEn: "#112 Neo Heights Isehara, 1-22-15 Sakuradai,\nIsehara-shi, Kanagawa 259-1132, Japan",
  addressJp: "神奈川県伊勢原市桜台1-22-15\nネオハイツ伊勢原112 (〒259-1132)",
  email: "contact@yellowhouse.jp",
  phone: "",
  hoursZh: "週一至週五 09:00 - 18:00 (JST)\n週末與日本國定假日可預約線上諮詢",
  hoursEn: "Mon - Fri 09:00 - 18:00 (JST)\nOnline consultations available on weekends by appointment",
  hoursJp: "月曜〜金曜 09:00 - 18:00 (JST)\n週末・祝日はオンライン相談予約可",
  social: { line: "", instagram: "", whatsapp: "", facebook: "", linkedin: "", x: "" },
  ctaTitleZh: "展開您的日本不動產旅程",
  ctaTitleEn: "Begin Your Real Estate Journey in Japan",
  ctaTitleJp: "日本での不動産取引を、私たちと共に",
  ctaButtonZh: "立即預約諮詢",
  ctaButtonEn: "SCHEDULE CONSULTATION",
  ctaButtonJp: "無料相談を予約する",
  customCss: "",
};

export const DEFAULT_HOME: SiteSettingsHome = {
  heroSlides: [],
  heroTitleLine1Zh: "日本在地的",
  heroTitleLine1En: "Your Practical Partner in",
  heroTitleLine1Jp: "日本に根差した",
  heroTitleLine2Zh: "不動產實務夥伴",
  heroTitleLine2En: "Japan Real Estate",
  heroTitleLine2Jp: "不動産実務パートナー",
  heroDescZh:
    "我們不只介紹物件，更理解持有與經營。從取得、持有、管理、開發、營運到出售，以15年實務經驗協助客戶做出更完整的判斷。",
  heroDescEn:
    "We don't just introduce properties; we understand what it takes to own and operate them. From acquisition, holding, management, development, and operations to resale, our 15 years of hands-on experience empower you to make informed decisions.",
  heroDescJp:
    "私たちは物件をご紹介するだけではなく、所有と経営の実態を理解しています。取得、保有、管理、開発、運営から売却まで、15年の実務経験でお客様の的確な判断をサポートします。",
  heroImage: "",
  primaryCtaZh: "預約諮詢",
  primaryCtaEn: "BOOK CONSULTATION",
  primaryCtaJp: "相談を予約する",
  trustStats: [
    { valueZh: "15年實務經驗", valueEn: "15 Years Track Record", valueJp: "15年の実務経験" },
    { valueZh: "正式宅建業執照", valueEn: "Licensed Real Estate Broker", valueJp: "宅地建物取引業免許取得済み" },
    { valueZh: "國際多語服務", valueEn: "Multilingual Advisory", valueJp: "多言語対応サービス" },
    { valueZh: "神奈川縣知事 (1) 第32070號", valueEn: "Governor of Kanagawa (1) No. 32070", valueJp: "神奈川県知事（1）第32070号" },
  ],
  bizTourTitleZh: "主要業務範疇", bizTourTitleEn: "Our Core Business Scope", bizTourTitleJp: "主要事業内容",
  bizTourDescZh: "主要業務涵蓋交易、管理與價值提升。從土地到營運，具備完整實務經驗。",
  bizTourDescEn: "Covering transactions, management, and value enhancement from land to full operations with comprehensive practical expertise.",
  bizTourDescJp: "土地から運営まで、取引・管理・価値向上を網羅する豊富な実務経験を有しています。",
  bizTourItems: [
    {
      titleZh: "不動產買賣仲介", titleEn: "Real Estate Brokerage", titleJp: "不動産売買仲介",
      descZh: "住宅、收益型不動產、商業用不動產及土地的購買與出售。",
      descEn: "Acquisition and sale of residential estates, income-generating assets, commercial properties, and land.",
      descJp: "居住用不動産、収益不動産、商業用不動産及び土地の売買を仲介します。",
      item1Zh: "物件搜尋與現場確認", item1En: "Property search & on-site due diligence", item1Jp: "物件探索及び現地調査",
      item2Zh: "價格及交易條件交涉", item2En: "Price & transaction terms negotiation", item2Jp: "価格及び取引条件の交渉",
      item3Zh: "契約、交屋與登記協調", item3En: "Contract, closing & title registration coordination", item3Jp: "契約、引き渡し及び登記手続きの調整",
    },
    {
      titleZh: "不動產租賃及管理", titleEn: "Leasing & Property Management", titleJp: "賃貸及び物件管理",
      descZh: "協助房東處理日常管理、租賃及修繕事務，確保收益穩定。",
      descEn: "Assisting landlords with day-to-day operations, tenant placement, and maintenance to safeguard steady returns.",
      descJp: "オーナー様の日常管理、入居者募集及び修繕業務をサポートし、安定した収益の維持に努めます。",
      item1Zh: "招租與租約管理", item1En: "Tenant recruitment & lease administration", item1Jp: "入居者募集及び賃貸借契約管理",
      item2Zh: "租金、退租與修繕", item2En: "Rent collection, move-outs & repair management", item2Jp: "賃料収受、退去対応及び修繕手配",
      item3Zh: "租賃糾紛相關應對", item3En: "Tenancy dispute resolution & legal compliance", item3Jp: "賃貸トラブル対応及び法令遵守",
    },
    {
      titleZh: "不動產收購再販", titleEn: "Property Acquisition & Value-Add Resale", titleJp: "不動産買取再販",
      descZh: "依據市場與利用方式，提升物件價值後重新出售。",
      descEn: "Enhancing asset value through strategic renovation and repurposing before repositioning in the market.",
      descJp: "市場動向と活用方法を見極め、物件の価値を高めたうえで再販します。",
      item1Zh: "物件收購與市場判斷", item1En: "Property acquisition & market valuation", item1Jp: "物件の買取及び市場価値の査定",
      item2Zh: "整修及價值提升", item2En: "Architectural refurbishment & value enhancement", item2Jp: "リノベーションによる価値向上",
      item3Zh: "重新定位與出售", item3En: "Strategic repositioning & resale execution", item3Jp: "再ポジショニング及び売却の実行",
    },
    {
      titleZh: "土地開發及自地自建", titleEn: "Land Development & Bespoke Construction", titleJp: "土地開発及び注文建築",
      descZh: "具備土地評估、土地利用規劃、自地自建及土地開發相關經驗。",
      descEn: "Proven track record in site evaluation, land utilization planning, bespoke construction, and property development.",
      descJp: "土地評価、土地活用計画、注文建築及び土地開発における豊富な実績を有しています。",
      item1Zh: "從建築、用途及未來收益角度判斷土地價值", item1En: "Evaluating land value from zoning, design & yield angles", item1Jp: "用途、建築計画及び将来収益の観点からの土地価値評価",
      item2Zh: "土地利用規劃與建築法規評估", item2En: "Architectural planning tailored to market demands", item2Jp: "土地活用計画及び建築法規の確認",
      item3Zh: "自地自建專案全流程規劃與落實", item3En: "End-to-end custom build project management", item3Jp: "注文建築プロジェクトの一貫した企画・実行",
    },
    {
      titleZh: "住宿設施營運", titleEn: "Hospitality & Accommodation Operations", titleJp: "宿泊施設運営",
      descZh: "實際從事民宿及住宿設施營運，具備從物件取得到營運管理的實務經驗。",
      descEn: "Hands-on experience in operating licensed vacation rentals and accommodation facilities from acquisition to daily guest hosting.",
      descJp: "民泊及び宿泊施設の運営を自ら手掛け、物件取得から日常運営まで実務経験を有しています。",
      item1Zh: "物件取得與合法執照取得", item1En: "Property acquisition & licensing compliance", item1Jp: "物件取得及び関連許認可の取得",
      item2Zh: "設施設置與空間規格規劃", item2En: "Facility setup & interior spatial planning", item2Jp: "施設設備及び客室仕様の企画",
      item3Zh: "營運管理與多語系旅客應對", item3En: "Daily operational management & guest communications", item3Jp: "日常運営管理及び多言語での宿泊者対応",
    },
  ],
  perspectiveTitleZh: "站在實際持有者的立場", perspectiveTitleEn: "Standing from the Owner & Operator's Perspective", perspectiveTitleJp: "実際の所有者・運営者の視点に立って",
  perspectiveDescZh: "我們的差異，在於不只具備仲介經驗，也擁有房東、投資、管理、開發及實際營運經驗。我們重視的不是單純完成交易，而是確認客戶購買的不動產是否符合實際目的。",
  perspectiveDescEn: "Our distinction lies in combining brokerage expertise with real-world experience as landlords, investors, property managers, developers, and hospitality operators. We prioritize whether an asset truly serves your ownership goals over merely closing a deal.",
  perspectiveDescJp: "私たちの強みは、仲介実務にとどまらず、オーナー、投資家、管理者、開発者、そして運営者としての経験を兼ね備えている点にあります。取引を成立させることよりも、その不動産がお客様の目的に本当に適しているかを重視しています。",
  perspectiveItems: [
    { titleZh: "物件本身的價值", titleEn: "Intrinsic Asset Value", titleJp: "物件そのものの価値", descZh: "確認地段、建物、權利與市場條件。", descEn: "Evaluating location, structural integrity, legal rights, and market conditions.", descJp: "立地、建物の状態、権利関係及び市場動向を確認します。" },
    { titleZh: "實際持有成本", titleEn: "Real Holding Costs", titleJp: "実際の保有コスト", descZh: "將稅費、管理、修繕與資金成本納入。", descEn: "Factoring in taxes, management fees, repair reserves, and financing costs.", descJp: "税金、管理費、修繕積立金及び資金調達コストを踏まえて判断します。" },
    { titleZh: "租賃及營運風險", titleEn: "Leasing & Operating Risks", titleJp: "賃貸及び運営リスク", descZh: "評估租戶、空置、收入與營運穩定性。", descEn: "Assessing tenant quality, vacancy risk, cash flow stability, and operational friction.", descJp: "入居者の質、空室リスク、収益及び運営の安定性を評価します。" },
    { titleZh: "修繕及管理問題", titleEn: "Maintenance & Aging Dynamics", titleJp: "修繕及び管理上の課題", descZh: "理解建物老化、設備與日常管理負擔。", descEn: "Understanding building depreciation, equipment upkeep, and daily management burdens.", descJp: "建物の経年劣化、設備及び日常管理の負担を把握します。" },
    { titleZh: "土地利用與開發", titleEn: "Land Utilization & Development", titleJp: "土地活用及び開発", descZh: "判斷用途、建築及未來利用可能性。", descEn: "Analyzing zoning allowances, architectural potential, and future upside.", descJp: "用途地域、建築の可能性及び将来性を見極めます。" },
    { titleZh: "出售及退場方式", titleEn: "Exit Strategy & Resale Liquidity", titleJp: "売却及び出口戦略", descZh: "購買前即考慮流動性、稅務與未來買家。", descEn: "Evaluating secondary market liquidity, future buyer profiles, and tax implications before acquisition.", descJp: "取得前の段階から流動性、税務及び将来の買い手を見据えて検討します。" },
  ],
  processTitleZh: "完整實務服務流程", processTitleEn: "Complete 6-Step Service Workflow", processTitleJp: "6つのステップによる一貫したサービス",
  processDescZh: "利用日本當地的實務經驗，協助海外客戶完成從選擇到出售的完整流程。",
  processDescEn: "Leveraging deep local Japan experience to support overseas clients through every phase from selection to profitable exit.",
  processDescJp: "日本国内での豊富な実務経験を活かし、物件選びから売却まで、海外のお客様を一貫してサポートします。",
  processFlowSteps: [
    { titleZh: "物件選擇", titleEn: "Property Selection", titleJp: "物件選定", descZh: "依據自住或投資目標，精選符合條件與實際持有價值的優質標的。", descEn: "Carefully curating assets aligned with your residential standards or investment targets.", descJp: "自己居住または投資目的に応じ、実際の保有価値に見合った優良物件を厳選します。" },
    { titleZh: "調查", titleEn: "Investigation & Due Diligence", titleJp: "調査・デューデリジェンス", descZh: "深入調查地段、建物狀況、法規權利、持有成本與修繕歷史。", descEn: "Conducting on-site surveys, structural audits, legal checks, and full cost assessments.", descJp: "立地、建物状況、権利関係及び保有コスト、修繕履歴を詳細に調査します。" },
    { titleZh: "契約", titleEn: "Contract & Negotiation", titleJp: "契約・交渉", descZh: "專業交涉價格與交易條件，提供清晰合規的契約審閱與法定說明。", descEn: "Negotiating optimal terms and providing clear, legally compliant bilingual contract reviews.", descJp: "価格及び取引条件を専門的に交渉し、明快で法令に準拠した契約内容をご説明します。" },
    { titleZh: "交屋", titleEn: "Settlement & Closing", titleJp: "決済・引き渡し", descZh: "協調款項交付、所有權移轉登記及現場點交等所有法定手續。", descEn: "Coordinating fund transfers, official title registration, and formal key handover.", descJp: "資金決済、所有権移転登記及び物件の引き渡しなど、法定手続きを調整します。" },
    { titleZh: "購買後管理", titleEn: "Post-Purchase Management", titleJp: "購入後の管理", descZh: "涵蓋租賃招租、日常修繕、營運維護與收支管理，讓海外持有無後顧之憂。", descEn: "Handling tenant leasing, regular maintenance, repair management, and financial accounting.", descJp: "入居者募集、日常修繕、運営維持及び収支管理まで対応し、海外からの資産保有を安心なものにします。" },
    { titleZh: "未來出售", titleEn: "Future Exit & Resale", titleJp: "将来の売却", descZh: "預先評估市場流動性與稅務規劃，在最佳時機協助退場獲利。", descEn: "Assessing market liquidity and tax implications to facilitate timely, profitable divestment.", descJp: "市場流動性及び税務面を事前に見極め、最適なタイミングでの売却をサポートします。" },
  ],
  advisorTitleZh: "15年不動產實務\n來自親自參與每一個環節",
  advisorTitleEn: "15 Years of Practical Experience\nRooted in Every Stage of Real Estate",
  advisorTitleJp: "15年の不動産実務、\nすべての工程に自ら携わってきた経験",
  representative: {
    nameZh: "黃經祐", nameEn: "Kei-Yu Huang", nameJp: "黄経祐",
    roleZh: "代表人 ｜ 房東 ｜ 不動產投資人", roleEn: "Representative ｜ Landlord ｜ Real Estate Investor", roleJp: "代表者｜オーナー｜不動産投資家",
    descZh: "在日本累積約15年的不動產實務經驗。實際參與經驗涵蓋物件購買、出租管理與修繕、不動產仲介、自地自建專案、土地評估、利用規劃與開發，以及住宿設施取得與營運。不是只從仲介成交看物件，而是從實際持有與經營結果判斷。",
    descEn: "Accumulating approximately 15 years of hands-on real estate practice in Japan. Directly engaged in acquisitions, leasing management, renovations, brokerage, bespoke developments, land planning, and hospitality facility operations. We evaluate properties through the lens of actual ownership and operational success, never just transactional closing.",
    descJp: "日本国内で約15年にわたり不動産実務に携わってきました。物件取得、賃貸管理及び修繕、不動産仲介、注文建築プロジェクト、土地評価、活用計画及び開発、そして宿泊施設の取得・運営まで、あらゆる現場を自ら経験しています。仲介成約の視点だけでなく、実際の保有と経営の結果から物件を見極めます。",
    image: "",
  },
};

export const DEFAULT_COMPANY: SiteSettingsCompany = {
  bannerTagZh: "COMPANY PROFILE", bannerTagEn: "COMPANY PROFILE", bannerTagJp: "COMPANY PROFILE",
  bannerH1Zh: "日本在地的不動產實務夥伴", bannerH1En: "Your Practical Real Estate Partner in Japan", bannerH1Jp: "日本に根差した不動産実務パートナー",
  bannerDescZh: "從取得、持有、管理、開發、營運到出售，以實際經驗協助客戶做出更完整的判斷。",
  bannerDescEn: "From acquisition, holding, management, development, and operations to resale, our hands-on experience empowers you to make informed decisions.",
  bannerDescJp: "取得、保有、管理、開発、運営から売却まで、実務経験に基づきお客様の的確な判断をサポートします。",
  bannerBadgeZh: "實務經驗 15 年", bannerBadgeEn: "15 YEARS TRACK RECORD", bannerBadgeJp: "実務経験15年",
  repTagZh: "代表人背景", repTagEn: "REPRESENTATIVE PROFILE", repTagJp: "代表者プロフィール",
  repHeadlineZh: "15年不動產實務，\n來自親自參與每一個環節。", repHeadlineEn: "15 Years of Practical Experience,\nRooted in Every Single Stage.", repHeadlineJp: "15年の不動産実務、\nすべての工程に自ら携わってきた経験。",
  repP1Zh: "株式会社イエローハウスカンパニー是一家立足日本，並持有正式宅地建物取引業執照的不動產公司。我們不只介紹物件，更理解持有與經營。",
  repP1En: "Yellow House Company Inc. (株式会社イエローハウスカンパニー) is a licensed Japanese real estate corporation holding an official Real Estate Brokerage License. We don't just introduce properties; we deeply understand what it takes to own and operate them.",
  repP1Jp: "株式会社イエローハウスカンパニーは、日本国内で宅地建物取引業の正式な免許を取得した不動産会社です。私たちは物件をご紹介するだけでなく、所有と経営の実態を深く理解しています。",
  repP2Zh: "我們從買方、房東、投資人及經營者的角度，協助客戶判斷物件的價值、成本與風險。不以成交為唯一目的，而是確認物件是否適合實際持有與經營。",
  repP2En: "From the multi-faceted perspectives of buyers, landlords, investors, and operators, we assist clients in evaluating true asset value, total cost of ownership, and operational risks. Our goal is never just closing a transaction, but confirming whether an asset is genuinely suited for long-term ownership and operation.",
  repP2Jp: "買主、オーナー、投資家及び運営者、それぞれの視点から、物件の価値、コスト及びリスクをお客様と共に見極めます。取引の成立のみを目的とせず、その物件が実際の保有及び経営に適しているかを確認することを大切にしています。",
  repNameRoleZh: "黃經祐 ｜ 代表人・房東・不動產投資人", repNameRoleEn: "Kei-Yu Huang ｜ Representative Director ・ Landlord ・ Investor", repNameRoleJp: "黄経祐 ｜ 代表・オーナー・不動産投資家",
  overviewTagZh: "COMPANY INFORMATION", overviewTagEn: "COMPANY INFORMATION", overviewTagJp: "COMPANY INFORMATION",
  overviewTitleZh: "公司基本資料", overviewTitleEn: "Corporate Overview", overviewTitleJp: "会社概要",
  quoteZh: "「不以成交為唯一目的，\n而是確認物件是否適合實際持有與經營。」",
  quoteEn: "“Not merely closing transactions, but confirming whether an asset is truly suited for actual ownership and operations.”",
  quoteJp: "「取引の成立のみを目的とせず、\nその物件が実際の保有及び経営に適しているかを確認する。」",
  quoteDescZh: "我們的差異，在於站在實際持有者的立場。不只具備仲介經驗，也擁有房東、投資、管理、開發及實際營運經驗，為您提供最務實的判斷。",
  quoteDescEn: "Our distinction lies in standing firmly in the shoes of actual property owners. Beyond agency brokerage, our direct experience in holding, managing, developing, and operating real estate ensures you receive the most practical, objective guidance.",
  quoteDescJp: "私たちの強みは、実際の所有者としての視点に立っていることです。仲介実務にとどまらず、オーナー、投資家、管理者及び運営者としての経験を活かし、最も実務的な判断材料をご提供します。",
  visitTagZh: "OUR OFFICE", visitTagEn: "OUR OFFICE", visitTagJp: "OUR OFFICE",
  visitTitleZh: "神奈川 本社", visitTitleEn: "Kanagawa Headquarters", visitTitleJp: "神奈川本社",
};

export const DEFAULT_CONTACT: SiteSettingsContact = {
  bannerTagZh: "CONTACT US", bannerTagEn: "CONTACT US", bannerTagJp: "CONTACT US",
  bannerH1Zh: "聯絡我們", bannerH1En: "Contact Us", bannerH1Jp: "お問い合わせ",
  bannerDescZh: "日本在地的實務不動產夥伴。無論您需要購置自住豪宅、投資收益型資產、租賃管理、自地自建或民宿營運諮詢，歡迎隨時與我們聯繫。",
  bannerDescEn: "Your practical real estate partner in Japan. Whether you are seeking prime residential estates, commercial investments, leasing management, custom builds, or hospitality operations, we are here to assist.",
  bannerDescJp: "日本に根差した不動産実務パートナーです。高級レジデンスの購入、収益不動産への投資、賃貸管理、注文建築、宿泊施設運営など、どのようなご相談でもお気軽にお問い合わせください。",
  quoteZh: "「從取得、持有、管理、開發、營運到出售，以實際經驗協助客戶做出更完整的判斷。」",
  quoteEn: "“From acquisition, holding, management, development, and operations to resale, our hands-on experience empowers you to make informed decisions.”",
  quoteJp: "「取得、保有、管理、開発、運営から売却まで、実務経験に基づきお客様の的確な判断をサポートします。」",
};

export const DEFAULT_NEWS: SiteSettingsNews = {
  bannerTagZh: "NEWS & UPDATES", bannerTagEn: "NEWS & UPDATES", bannerTagJp: "NEWS & UPDATES",
  bannerH1Zh: "最新消息與市場動態", bannerH1En: "News & Market Updates", bannerH1Jp: "ニュース及び市場動向",
  bannerDescZh: "株式会社イエローハウスカンパニー的最新業務進展、日本不動產市場洞察與實務專題分享。",
  bannerDescEn: "Latest corporate announcements, Japan real estate market insights, and practical advisory topics from Yellow House Company.",
  bannerDescJp: "株式会社イエローハウスカンパニーの最新の事業動向、日本の不動産市場に関する洞察及び実務コラムをお届けします。",
  categoryTitleZh: "分類", categoryTitleEn: "CATEGORIES", categoryTitleJp: "カテゴリー",
};

export const DEFAULT_CASES: SiteSettingsCases = {
  bannerTagZh: "PORTFOLIO", bannerTagEn: "PORTFOLIO", bannerTagJp: "PORTFOLIO",
  bannerH1Zh: "實績案例與精選項目", bannerH1En: "Selected Portfolio & Case Studies", bannerH1Jp: "実績紹介及び厳選プロジェクト",
  bannerDescZh: "涵蓋高級自住住宅、收益型商辦、土地開發與住宿設施，展現我們在買賣、管理、整修與營運上的深厚實務經驗。",
  bannerDescEn: "Spanning prime residential homes, commercial office buildings, land developments, and hospitality assets—demonstrating our deep practical track record across acquisitions, management, and operations.",
  bannerDescJp: "高級居住用不動産、収益商業ビル、土地開発及び宿泊施設まで、売買、管理、リノベーション及び運営における豊富な実務実績をご紹介します。",
};

export const DEFAULT_CATEGORIES: SiteSettingsCategories = {
  news: [
    { key: "market", labelZh: "市場動態", labelEn: "Market Insights", labelJp: "市場インサイト" },
    { key: "guide", labelZh: "實務指南", labelEn: "Practical Guide", labelJp: "実務ガイド" },
    { key: "management", labelZh: "管理實務", labelEn: "Asset Management", labelJp: "資産管理" },
    { key: "regulation", labelZh: "法規政策", labelEn: "Regulations", labelJp: "法規制" },
  ],
  cases: [
    { key: "residential", labelZh: "住宅不動產", labelEn: "Residential", labelJp: "住宅用不動産" },
    { key: "commercial", labelZh: "商業與收益型", labelEn: "Commercial", labelJp: "商業・収益不動産" },
    { key: "development", labelZh: "土地開發與自建", labelEn: "Development", labelJp: "土地開発・注文建築" },
    { key: "renovation", labelZh: "收購再販與翻新", labelEn: "Renovation & Resale", labelJp: "買取再販・リノベーション" },
    { key: "hospitality", labelZh: "住宿設施營運", labelEn: "Hospitality", labelJp: "宿泊施設運営" },
  ],
};

export const DEFAULT_PROPERTIES: SiteSettingsProperties = {
  bannerTagZh: "PROPERTIES FOR SALE", bannerTagEn: "PROPERTIES FOR SALE", bannerTagJp: "販売物件",
  bannerH1Zh: "目前在售物件", bannerH1En: "Current Properties for Sale", bannerH1Jp: "現在販売中の物件",
  bannerDescZh: "精選目前實際在售的住宅、商用與土地物件，皆由本公司實際勘查與盡職調查後上架。",
  bannerDescEn: "A curated selection of residential, commercial, and land properties currently for sale, each verified through our own on-site due diligence.",
  bannerDescJp: "現在販売中の住宅・商業・土地物件を厳選してご紹介。すべて当社が現地調査を行ったうえで掲載しています。",
  ctaTitleZh: "找不到理想的物件？歡迎與我們聯繫", ctaTitleEn: "Can't find the right property? Talk to us.", ctaTitleJp: "ご希望の物件が見つからない方はお気軽にご相談ください",
  ctaButtonZh: "預約諮詢", ctaButtonEn: "BOOK CONSULTATION", ctaButtonJp: "相談を予約する",
};

export const DEFAULT_SERVICES: SiteSettingsServices = {
  bannerTagZh: "SERVICES", bannerTagEn: "SERVICES", bannerTagJp: "SERVICES",
  bannerH1Zh: "主要業務與服務項目", bannerH1En: "Core Businesses & Services", bannerH1Jp: "主要事業及びサービス内容",
  bannerDescZh: "主要業務涵蓋交易、管理與價值提升。從取得、持有、管理、開發、營運到出售，以實際經驗協助客戶做出更完整的判斷。",
  bannerDescEn: "Encompassing transactions, management, and value creation. From acquisition, holding, management, development, and operations to resale, our hands-on experience empowers you to make informed decisions.",
  bannerDescJp: "取引、管理及び価値向上を網羅する事業を展開しています。取得、保有、管理、開発、運営から売却まで、実務経験に基づきお客様の判断をサポートします。",
  flowTitleZh: "服務流程 / SERVICE FLOW", flowTitleEn: "SERVICE FLOW", flowTitleJp: "SERVICE FLOW",
  flowDescZh: "從前期準備、條件斡旋到尾款登記，嚴格把關每一階段法令與資金安全。",
  flowDescEn: "Guiding you with institutional precision from due diligence to final title registration.",
  flowDescJp: "事前準備から条件交渉、最終決済まで、各段階の法令遵守と資金の安全性を徹底管理します。",
  transactionPhases: [
    {
      titleZh: "準備階段", titleEn: "Preparation", titleJp: "準備段階",
      descZh: "資金規劃與文件審核，確保買賣資格與跨境資金流暢到位。",
      descEn: "Capital planning, KYC verification, and notarized identity documentation readiness.",
      descJp: "資金計画と書類確認を行い、取引資格と国際送金をスムーズに整えます。",
      item1Zh: "資金證明備妥", item1En: "Proof of funds readiness", item1Jp: "資金証明のご用意",
      item2Zh: "護照與身分認證文件", item2En: "Passport & notarized affidavit", item2Jp: "パスポート及び本人確認書類",
      item3Zh: "印鑑證明申請", item3En: "Affidavit of seal verification", item3Jp: "印鑑証明の取得",
    },
    {
      titleZh: "執行階段", titleEn: "Execution", titleJp: "実行段階",
      descZh: "出具正式買付證明書，代表買方進行價格條件斡旋與簽約期程確認。",
      descEn: "Issuing formal Letter of Intent, price negotiation, and timeline alignment with vendor.",
      descJp: "正式な買付証明書を発行し、買主様の代理として価格交渉及び契約スケジュールを調整します。",
      item1Zh: "提出買付證明書", item1En: "Letter of Intent (買付證明書)", item1Jp: "買付証明書の提出",
      item2Zh: "賣方承諾與條件合意", item2En: "Terms alignment with vendor", item2Jp: "売主様の承諾と条件合意",
      item3Zh: "安排簽約日程", item3En: "Contract scheduling", item3Jp: "契約日程の調整",
    },
    {
      titleZh: "契約階段", titleEn: "Contract", titleJp: "契約段階",
      descZh: "宅建士重要事項說明與公證契約締結，確保法令產權無虞。",
      descEn: "Statutory explanation of important matters by licensed specialist and agreement execution.",
      descJp: "宅地建物取引士による重要事項説明と契約締結を行い、法的な権利関係を確実にします。",
      item1Zh: "繳交訂金 (房價5-10%)", item1En: "Deposit payment (typically 5-10%)", item1Jp: "手付金のお支払い（物件価格の5〜10%）",
      item2Zh: "簽署買賣契約書", item2En: "Purchase agreement execution", item2Jp: "売買契約書へのご署名",
      item3Zh: "印花稅票貼付", item3En: "Stamp duty tax handling", item3Jp: "印紙税の貼付",
    },
    {
      titleZh: "結算階段", titleEn: "Settlement", titleJp: "決済段階",
      descZh: "司法書士共同會審完成尾款清算、稅費繳交與所有權移轉登記。",
      descEn: "Closing settlement, title deed registration with judicial scrivener, and physical key handover.",
      descJp: "司法書士立会いのもと残代金の決済、諸費用のお支払い、所有権移転登記を行います。",
      item1Zh: "支付尾款與各項稅費", item1En: "Balance payment & tax clearance", item1Jp: "残代金及び諸費用のお支払い",
      item2Zh: "辦理登記手續", item2En: "Judicial scrivener registration", item2Jp: "登記手続き",
      item3Zh: "房屋點交與鑰匙交付", item3En: "Physical handover of keys", item3Jp: "鍵の引き渡し",
    },
  ],
  stepsTitleZh: "完整購置與持有流程", stepsTitleEn: "Comprehensive Workflow", stepsTitleJp: "取得から保有までの一貫したフロー",
  acquisitionSteps: [
    {
      titleZh: "初步諮詢與需求確認", titleEn: "Initial Consultation & Goal Alignment", titleJp: "初回相談とご要望の確認",
      descZh: "深入了解您的購置目的、預算範圍及特定偏好，為後續物件篩選奠定基礎。",
      descEn: "Deep dive into your purchase purpose, budget structure, and timeline to form a strategic baseline.",
      descJp: "ご購入の目的、ご予算、具体的なご希望を丁寧にヒアリングし、後続の物件選定の土台を構築します。",
    },
    {
      titleZh: "物件提案與篩選", titleEn: "Curated Proposal & Off-Market Sourcing", titleJp: "物件のご提案と絞り込み",
      descZh: "提供符合條件之精選物件清單，包含獨家未公開案源，並進行優劣勢分析。",
      descEn: "Shortlist prime and exclusive off-market properties with exhaustive comparative analysis.",
      descJp: "未公開物件を含む厳選リストをご提供し、それぞれのメリット・デメリットを分析いたします。",
    },
    {
      titleZh: "現場看屋與環境勘查", titleEn: "Private Viewings & Site Inspection", titleJp: "内見と周辺環境の確認",
      descZh: "安排專人陪同視察物件實況，檢視周邊環境機能與建築結構品質。",
      descEn: "Coordinate discreet on-site or high-definition live virtual tours covering architectural build and neighborhood.",
      descJp: "専任担当が同行し、物件の実際の状態や周辺環境、建物の構造品質を確認します。",
    },
    {
      titleZh: "價格協商與條件斡旋", titleEn: "Price Negotiation & Terms Structuring", titleJp: "価格交渉と条件調整",
      descZh: "代表買方與賣方進行價格及交易條件交涉，確保客戶利益最大化。",
      descEn: "Actively advocate for your financial and contract terms to maximize value and security.",
      descJp: "買主様の代理として売主様と価格及び取引条件を交渉し、お客様の利益を最大化します。",
    },
    {
      titleZh: "重要事項說明與簽約", titleEn: "Explanation of Important Matters & Contract", titleJp: "重要事項説明とご契約",
      descZh: "由專業宅地建物取引士進行詳盡的產權及法規說明，確認無誤後簽署買賣契約。",
      descEn: "Conducted by licensed Real Estate Transaction Specialists (宅建士) before formal signing.",
      descJp: "専門の宅地建物取引士が権利関係及び法令に関する詳細な説明を行い、ご納得いただいた上でご契約を締結します。",
    },
    {
      titleZh: "貸款協助與資金規劃", titleEn: "Cross-Border Financing & Fund Flow", titleJp: "融資サポートと資金計画",
      descZh: "協助外籍人士對接合適之金融機構辦理貸款，並規劃跨國匯款流程。",
      descEn: "Introduce leading banks for non-resident mortgages and structure compliant capital routing.",
      descJp: "海外のお客様に適した金融機関との連携を支援し、国際送金の手続きを計画します。",
    },
    {
      titleZh: "交屋結算與產權移轉", titleEn: "Final Settlement & Title Transfer", titleJp: "決済と所有権移転",
      descZh: "會同司法書士辦理尾款結算及所有權移轉登記，正式交付鑰匙與產權文件。",
      descEn: "Complete deed transfer and title registration with licensed judicial scriveners, followed by key handover.",
      descJp: "司法書士と連携して残代金の決済及び所有権移転登記を行い、鍵と権利書類を正式にお引き渡しします。",
    },
  ],
  taxesTitleZh: "相關費用及稅金概要", taxesTitleEn: "Associated Costs & Taxes Summary", taxesTitleJp: "関連費用及び税金の概要",
  buyLabelZh: "購入時", buyLabelEn: "Upon Purchase", buyLabelJp: "購入時",
  buyValZh: "仲介手續費 / 不動產取得稅 / 印花稅 / 登記免許稅 / 固都稅精算",
  buyValEn: "Brokerage Fee / Property Acquisition Tax / Stamp Duty / Registration Tax / Prorated Fixed Asset Tax",
  buyValJp: "仲介手数料／不動産取得税／印紙税／登録免許税／固定資産税・都市計画税の精算",
  holdLabelZh: "持有期間", holdLabelEn: "Holding Period", holdLabelJp: "保有期間中",
  holdValZh: "固定資產稅 / 都市計畫稅 / 管理費 / 修繕積立金 / 所得稅申報",
  holdValEn: "Fixed Asset Tax / City Planning Tax / Building Management Fee / Repair Reserve / Income Tax Filing",
  holdValJp: "固定資産税／都市計画税／管理費／修繕積立金／所得税の申告",
  sellLabelZh: "出售時", sellLabelEn: "Upon Sale", sellLabelJp: "売却時",
  sellValZh: "讓渡所得稅 / 仲介手續費 / 登記手續費",
  sellValEn: "Capital Gains Tax / Brokerage Commission / Registration Fees",
  sellValJp: "譲渡所得税／仲介手数料／登記費用",
  mgmtTitleZh: "租賃及日常管理業務", mgmtTitleEn: "Leasing & Property Management Operations", mgmtTitleJp: "賃貸及び日常管理業務",
  mgmtDescZh: "協助房東處理日常管理、租賃及修繕事務，以實際房東與經營者的經驗，讓身在海外的您安心持有日本資產。",
  mgmtDescEn: "Assisting owners with tenant placement, rent collection, and repairs. Our hands-on landlord experience ensures your Japanese property is managed with complete peace of mind.",
  mgmtDescJp: "オーナー様の入居者募集、賃料収受及び修繕対応をサポートします。オーナー及び運営者としての実務経験により、海外にいらっしゃるお客様にも安心して日本の資産を保有いただけます。",
  mgmtItem1Zh: "招租與租約管理（嚴格審查承租人資格）",
  mgmtItem1En: "Tenant recruitment & strict background verification",
  mgmtItem1Jp: "入居者募集及び賃貸借契約管理（入居審査を厳格に実施）",
  mgmtItem2Zh: "租金收取、匯款與日常收支明細管理",
  mgmtItem2En: "Rent collection, overseas remittance & financial reporting",
  mgmtItem2Jp: "賃料収受、海外送金及び収支明細管理",
  mgmtItem3Zh: "建物老化維護、設備修繕與日常管理負擔減輕",
  mgmtItem3En: "Preventative building upkeep, equipment repairs & burden mitigation",
  mgmtItem3Jp: "建物経年劣化への対応、設備修繕及び日常管理負担の軽減",
  mgmtItem4Zh: "租賃糾紛應對、退租點交與原狀恢復落實",
  mgmtItem4En: "Dispute mediation, move-out inspections & restoration oversight",
  mgmtItem4Jp: "賃貸トラブル対応、退去立会い及び原状回復の管理",
  ctaTitleZh: "討論您的日本不動產需求", ctaTitleEn: "Discuss Your Japanese Real Estate Strategy", ctaTitleJp: "日本の不動産戦略についてご相談ください",
  ctaBtnZh: "預約專業諮詢", ctaBtnEn: "SCHEDULE CONSULTATION", ctaBtnJp: "専門相談を予約する",
};

export const DEFAULT_SEO: SiteSettingsSeo = {
  defaultTitleZh: "Yellow House - 日本在地的實務不動產夥伴 | 株式会社イエローハウスカンパニー",
  defaultTitleEn: "Yellow House - Your Practical Real Estate Partner in Japan",
  defaultTitleJp: "Yellow House - 日本の不動産を実務目線でサポート",
  defaultDescriptionZh: "立足日本，持有正式宅地建物取引業執照，提供不動產買賣、租賃管理、開發與住宿設施營運的全方位實務支持。",
  defaultDescriptionEn:
    "Licensed Japan real estate brokerage offering brokerage, leasing management, development, and hospitality operations for overseas clients.",
  defaultDescriptionJp: "日本国内で宅地建物取引業の免許を持ち、売買仲介から賃貸管理、開発、宿泊施設運営まで支援します。",
  ogImage: "",
  pages: {},
};

export function watchGeneral(cb: (v: SiteSettingsGeneral) => void) {
  return onSnapshot(doc(db, "site_settings", "general"), (snap) => {
    cb(snap.exists() ? { ...DEFAULT_GENERAL, ...(snap.data() as SiteSettingsGeneral) } : DEFAULT_GENERAL);
  });
}

export function watchHome(cb: (v: SiteSettingsHome) => void) {
  return onSnapshot(doc(db, "site_settings", "home"), (snap) => {
    cb(snap.exists() ? { ...DEFAULT_HOME, ...(snap.data() as SiteSettingsHome) } : DEFAULT_HOME);
  });
}

export function watchSeo(cb: (v: SiteSettingsSeo) => void) {
  return onSnapshot(doc(db, "site_settings", "seo"), (snap) => {
    cb(snap.exists() ? { ...DEFAULT_SEO, ...(snap.data() as SiteSettingsSeo) } : DEFAULT_SEO);
  });
}

export function watchCompany(cb: (v: SiteSettingsCompany) => void) {
  return onSnapshot(doc(db, "site_settings", "company"), (snap) => {
    cb(snap.exists() ? { ...DEFAULT_COMPANY, ...(snap.data() as SiteSettingsCompany) } : DEFAULT_COMPANY);
  });
}

export function watchContact(cb: (v: SiteSettingsContact) => void) {
  return onSnapshot(doc(db, "site_settings", "contact"), (snap) => {
    cb(snap.exists() ? { ...DEFAULT_CONTACT, ...(snap.data() as SiteSettingsContact) } : DEFAULT_CONTACT);
  });
}

export function watchCategories(cb: (v: SiteSettingsCategories) => void) {
  return onSnapshot(doc(db, "site_settings", "categories"), (snap) => {
    cb(snap.exists() ? { ...DEFAULT_CATEGORIES, ...(snap.data() as SiteSettingsCategories) } : DEFAULT_CATEGORIES);
  });
}

export function watchNews(cb: (v: SiteSettingsNews) => void) {
  return onSnapshot(doc(db, "site_settings", "news"), (snap) => {
    cb(snap.exists() ? { ...DEFAULT_NEWS, ...(snap.data() as SiteSettingsNews) } : DEFAULT_NEWS);
  });
}

export function watchCases(cb: (v: SiteSettingsCases) => void) {
  return onSnapshot(doc(db, "site_settings", "cases"), (snap) => {
    cb(snap.exists() ? { ...DEFAULT_CASES, ...(snap.data() as SiteSettingsCases) } : DEFAULT_CASES);
  });
}

export function watchProperties(cb: (v: SiteSettingsProperties) => void) {
  return onSnapshot(doc(db, "site_settings", "properties"), (snap) => {
    cb(snap.exists() ? { ...DEFAULT_PROPERTIES, ...(snap.data() as SiteSettingsProperties) } : DEFAULT_PROPERTIES);
  });
}

export function watchServices(cb: (v: SiteSettingsServices) => void) {
  return onSnapshot(doc(db, "site_settings", "services"), (snap) => {
    cb(snap.exists() ? { ...DEFAULT_SERVICES, ...(snap.data() as SiteSettingsServices) } : DEFAULT_SERVICES);
  });
}

export async function getGeneralOnce(): Promise<SiteSettingsGeneral> {
  const snap = await getDoc(doc(db, "site_settings", "general"));
  return snap.exists() ? { ...DEFAULT_GENERAL, ...(snap.data() as SiteSettingsGeneral) } : DEFAULT_GENERAL;
}
