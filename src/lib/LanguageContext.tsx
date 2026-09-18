import React, { createContext, useContext, useEffect } from "react";
import { useLocation } from "wouter";

export type Language = "zh" | "en" | "jp";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  /** Prefixes an app-relative path (e.g. "/services") with the current locale. */
  localePath: (path: string) => string;
  /** BCP-47 code for <html lang>/hreflang — NOT the same as the "jp" URL segment. */
  htmlLang: string;
}

const translations: Record<Language, Record<string, string>> = {
  zh: {
    // Nav
    "nav.home": "首頁",
    "nav.services": "服務項目",
    "nav.company": "公司簡介",
    "nav.cases": "實績案例",
    "nav.properties": "在售物件",
    "nav.news": "最新消息",
    "nav.contact": "聯絡我們",
    "nav.menu": "開啟選單",

    // Common CTA Banner
    "cta.title": "展開您的日本不動產旅程",
    "cta.button": "立即預約諮詢",

    // Footer
    "footer.desc": "立足日本，持有正式宅地建物取引業執照。從買賣仲介、租賃管理、收購再販、土地開發、自地自建到住宿設施營運，提供全方位的不動產實務支持。",
    "footer.nav": "網站導覽",
    "footer.location": "公司所在地",
    "footer.copyright": "© 2026 株式会社イエローハウスカンパニー (YELLOW HOUSE COMPANY). ALL RIGHTS RESERVED.",
    "footer.privacy": "隱私權政策",
    "footer.terms": "服務條款",
    "footer.map_label": "神奈川 本社",
    "footer.social": "社群媒體",

    // Home
    "home.title": "Yellow House - 日本在地的實務不動產夥伴 | 株式会社イエローハウスカンパニー",
    "home.hero.title_line1": "日本在地的",
    "home.hero.title_line2": "不動產實務夥伴",
    "home.hero.desc": "我們不只介紹物件，更理解持有與經營。從取得、持有、管理、開發、營運到出售，以15年實務經驗協助客戶做出更完整的判斷。",
    "home.hero.consult": "預約諮詢",
    "home.hero.view_properties": "探索主要業務",
    "home.stat.experience_label": "EXPERIENCE",
    "home.stat.experience_val": "15年實務經驗",
    "home.stat.certified_label": "CERTIFIED",
    "home.stat.certified_val": "正式宅建業執照",
    "home.stat.global_label": "GLOBAL",
    "home.stat.global_val": "國際雙語服務",
    "home.stat.license_label": "LICENSE",
    "home.stat.license_val": "神奈川縣知事 (1) 第32070號",



    // Home - Major Businesses (04 主要業務 I & 05 主要業務 II)
    "home.services.tag": "CORE BUSINESSES",
    "home.services.title": "主要業務範疇",
    "home.services.desc": "主要業務涵蓋交易、管理與價值提升。從土地到營運，具備完整實務經驗。",
    
    // Business 1
    "home.biz1.num": "01",
    "home.biz1.title": "不動產買賣仲介",
    "home.biz1.desc": "住宅、收益型不動產、商業用不動產及土地的購買與出售。",
    "home.biz1.item1": "物件搜尋與現場確認",
    "home.biz1.item2": "價格及交易條件交涉",
    "home.biz1.item3": "契約、交屋與登記協調",

    // Business 2
    "home.biz2.num": "02",
    "home.biz2.title": "不動產租賃及管理",
    "home.biz2.desc": "協助房東處理日常管理、租賃及修繕事務，確保收益穩定。",
    "home.biz2.item1": "招租與租約管理",
    "home.biz2.item2": "租金、退租與修繕",
    "home.biz2.item3": "租賃糾紛相關應對",

    // Business 3
    "home.biz3.num": "03",
    "home.biz3.title": "不動產收購再販",
    "home.biz3.desc": "依據市場與利用方式，提升物件價值後重新出售。",
    "home.biz3.item1": "物件收購與市場判斷",
    "home.biz3.item2": "整修及價值提升",
    "home.biz3.item3": "重新定位與出售",

    // Business 4
    "home.biz4.num": "04",
    "home.biz4.title": "土地開發及自地自建",
    "home.biz4.desc": "具備土地評估、土地利用規劃、自地自建及土地開發相關經驗。",
    "home.biz4.item1": "從建築、用途及未來收益角度判斷土地價值",
    "home.biz4.item2": "土地利用規劃與建築法規評估",
    "home.biz4.item3": "自地自建專案全流程規劃與落實",

    // Business 5
    "home.biz5.num": "05",
    "home.biz5.title": "住宿設施營運",
    "home.biz5.desc": "實際從事民宿及住宿設施營運，具備從物件取得到營運管理的實務經驗。",
    "home.biz5.item1": "物件取得與合法執照取得",
    "home.biz5.item2": "設施設置與空間規格規劃",
    "home.biz5.item3": "營運管理與多語系旅客應對",

    // Home - Perspective / 特色 (03 判斷視角 & 07 我們的特點)
    "home.perspective.tag": "OUR PERSPECTIVE",
    "home.perspective.title": "站在實際持有者的立場",
    "home.perspective.desc": "我們的差異，在於不只具備仲介經驗，也擁有房東、投資、管理、開發及實際營運經驗。我們重視的不是單純完成交易，而是確認客戶購買的不動產是否符合實際目的。",
    "home.perspective.item1_title": "物件本身的價值",
    "home.perspective.item1_desc": "確認地段、建物、權利與市場條件。",
    "home.perspective.item2_title": "實際持有成本",
    "home.perspective.item2_desc": "將稅費、管理、修繕與資金成本納入。",
    "home.perspective.item3_title": "租賃及營運風險",
    "home.perspective.item3_desc": "評估租戶、空置、收入與營運穩定性。",
    "home.perspective.item4_title": "修繕及管理問題",
    "home.perspective.item4_desc": "理解建物老化、設備與日常管理負擔。",
    "home.perspective.item5_title": "土地利用與開發",
    "home.perspective.item5_desc": "判斷用途、建築及未來利用可能性。",
    "home.perspective.item6_title": "出售及退場方式",
    "home.perspective.item6_desc": "購買前即考慮流動性、稅務與未來買家。",

    // Home - Advisor Profile (02 代表人背景)
    "home.advisor.tag": "REPRESENTATIVE",
    "home.advisor.title": "15年不動產實務\n來自親自參與每一個環節",
    "home.advisor.name": "黃經祐",
    "home.advisor.role": "代表人 ｜ 房東 ｜ 不動產投資人",
    "home.advisor.desc": "在日本累積約15年的不動產實務經驗。實際參與經驗涵蓋物件購買、出租管理與修繕、不動產仲介、自地自建專案、土地評估、利用規劃與開發，以及住宿設施取得與營運。不是只從仲介成交看物件，而是從實際持有與經營結果判斷。",
    "home.advisor.cta": "查看完整簡介",

    // Home - Process (06 服務流程)
    "home.process.tag": "PROCESS",
    "home.process.title": "完整實務服務流程",
    "home.process.desc": "利用日本當地的實務經驗，協助海外客戶完成從選擇到出售的完整流程。",
    "home.process.step1.title": "物件選擇",
    "home.process.step1.desc": "依據自住或投資目標，精選符合條件與實際持有價值的優質標的。",
    "home.process.step2.title": "調查",
    "home.process.step2.desc": "深入調查地段、建物狀況、法規權利、持有成本與修繕歷史。",
    "home.process.step3.title": "契約",
    "home.process.step3.desc": "專業交涉價格與交易條件，提供清晰合規的契約審閱與法定說明。",
    "home.process.step4.title": "交屋",
    "home.process.step4.desc": "協調款項交付、所有權移轉登記及現場點交等所有法定手續。",
    "home.process.step5.title": "購買後管理",
    "home.process.step5.desc": "涵蓋租賃招租、日常修繕、營運維護與收支管理，讓海外持有無後顧之憂。",
    "home.process.step6.title": "未來出售",
    "home.process.step6.desc": "預先評估市場流動性與稅務規劃，在最佳時機協助退場獲利。",
    "home.process.cta": "探索完整服務項目",

    // Services Page
    "services.title": "Yellow House - 服務項目 | 株式会社イエローハウスカンパニー",
    "services.banner.tag": "SERVICES",
    "services.banner.h1": "主要業務與服務項目",
    "services.banner.desc": "主要業務涵蓋交易、管理與價值提升。從取得、持有、管理、開發、營運到出售，以實際經驗協助客戶做出更完整的判斷。",
    "services.tag1": "不動產買賣仲介",
    "services.tag2": "不動產租賃及管理",
    "services.tag3": "不動產收購再販",
    "services.tag4": "土地開發及自地自建",
    "services.tag5": "住宿設施營運",
    "services.tag6": "海外置產顧問",
    "services.steps.title": "完整購置與持有流程",
    "services.flow.title": "服務流程 / SERVICE FLOW",
    "services.taxes.title": "相關費用及稅金概要",
    "services.taxes.buy_label": "購入時",
    "services.taxes.buy_val": "仲介手續費 / 不動產取得稅 / 印花稅 / 登記免許稅 / 固都稅精算",
    "services.taxes.hold_label": "持有期間",
    "services.taxes.hold_val": "固定資產稅 / 都市計畫稅 / 管理費 / 修繕積立金 / 所得稅申報",
    "services.taxes.sell_label": "出售時",
    "services.taxes.sell_val": "讓渡所得稅 / 仲介手續費 / 登記手續費",
    "services.mgmt.title": "租賃及日常管理業務",
    "services.mgmt.desc": "協助房東處理日常管理、租賃及修繕事務，以實際房東與經營者的經驗，讓身在海外的您安心持有日本資產。",
    "services.mgmt.item1": "招租與租約管理（嚴格審查承租人資格）",
    "services.mgmt.item2": "租金收取、匯款與日常收支明細管理",
    "services.mgmt.item3": "建物老化維護、設備修繕與日常管理負擔減輕",
    "services.mgmt.item4": "租賃糾紛應對、退租點交與原狀恢復落實",
    "services.cta.title": "討論您的日本不動產需求",
    "services.cta.btn": "預約專業諮詢",

    // Company Page (COMPANY INFORMATION 唯一依據)
    "company.title": "Yellow House - 公司簡介 | 株式会社イエローハウスカンパニー",
    "company.banner.tag": "COMPANY PROFILE",
    "company.banner.h1": "日本在地的不動產實務夥伴",
    "company.banner.desc": "從取得、持有、管理、開發、營運到出售，以實際經驗協助客戶做出更完整的判斷。",
    "company.rep.tag": "代表人背景",
    "company.rep.headline": "15年不動產實務，\n來自親自參與每一個環節。",
    "company.rep.p1": "株式会社イエローハウスカンパニー是一家立足日本，並持有正式宅地建物取引業執照的不動產公司。我們不只介紹物件，更理解持有與經營。",
    "company.rep.p2": "我們從買方、房東、投資人及經營者的角度，協助客戶判斷物件的價值、成本與風險。不以成交為唯一目的，而是確認物件是否適合實際持有與經營。",
    "company.overview.tag": "COMPANY INFORMATION",
    "company.overview.title": "公司基本資料",
    "company.overview.name_label": "公司名稱",
    "company.overview.name_val": "株式会社イエローハウスカンパニー (YELLOW HOUSE COMPANY)",
    "company.overview.loc_label": "公司地址",
    "company.overview.loc_val": "神奈川縣伊勢原市櫻台1-22-15\nネオハイツ伊勢原112 (〒259-1132)",
    "company.overview.lic_label": "執照",
    "company.overview.lic_val": "神奈川縣知事（1）第32070號",
    "company.overview.email_label": "Email",
    "company.overview.email_val": "contact@yellowhouse.jp",
    "company.overview.phone_label": "電話",
    "company.overview.phone_val": "-",
    "company.overview.hours_label": "營業時間",
    "company.overview.hours_val": "週一至週五 09:00 - 18:00 (JST)\n週末與日本國定假日可預約線上諮詢",
    "company.quote": "「不以成交為唯一目的，\n而是確認物件是否適合實際持有與經營。」",
    "company.quote_desc": "我們的差異，在於站在實際持有者的立場。不只具備仲介經驗，也擁有房東、投資、管理、開發及實際營運經驗，為您提供最務實的判斷。",
    "company.visit.tag": "OUR OFFICE",
    "company.visit.title": "神奈川 本社",
    "company.visit.btn": "前往 Google 地圖導航",

    // Cases Page
    "cases.title": "Yellow House - 實績案例",
    "cases.banner.tag": "PORTFOLIO",
    "cases.banner.h1": "實績案例與精選項目",
    "cases.banner.desc": "涵蓋高級自住住宅、收益型商辦、土地開發與住宿設施，展現我們在買賣、管理、整修與營運上的深厚實務經驗。",
    "cases.filter.all": "全部實績",
    "cases.filter.res": "住宅・自住",
    "cases.filter.com": "商用・收益型",
    "cases.card.view_detail": "查看詳情",
    "cases.card.inquire": "諮詢此標的",
    "cases.c1.tag": "高級住宅・東京港區",
    "cases.c1.title": "港區頂級高空景觀名邸",
    "cases.c1.desc": "位於東京核心地段的高級自住不動產，具備優異的建物品質、稀缺地段與完善物業管理，提供海外買家極致的自住生活體驗。",
    "cases.c1.specs": "專有面積 182㎡ ｜ 3LDK ｜ 永久產權",
    "cases.c2.tag": "收益商辦・東京涉谷",
    "cases.c2.title": "涉谷核心收益型商用大樓",
    "cases.c2.desc": "全棟滿租之核心商辦資產，具備穩定長期租金現金流，經過收益架構重整與修繕管理優化，實現穩健年化回報。",
    "cases.c2.specs": "整棟 RC 6階建 ｜ 滿租營運中 ｜ 永久產權",
    "cases.c3.tag": "自住名邸・東京涉谷",
    "cases.c3.title": "涉谷區靜謐住宅區獨棟別墅",
    "cases.c3.desc": "結合現代日式建築美學與綠意庭園的頂級自住住宅，兼具都心生活便利性與高度私密性。",
    "cases.c3.specs": "土地面積 210㎡ ｜ 建物面積 260㎡ ｜ 4LDK",
    "cases.c4.tag": "商業旗艦・東京中央區",
    "cases.c4.title": "中央區精品商業街角旗艦店",
    "cases.c4.desc": "位處高人流商業精華地段，具備極佳品牌展示效應與抗跌性，提供長期穩定租約與收益保障。",
    "cases.c4.specs": "整棟 4階建 ｜ 商業核心區 ｜ 永久產權",
    "cases.c5.tag": "頂級住宅・東京港區",
    "cases.c5.title": "六本木高空全景天際豪邸",
    "cases.c5.desc": "俯瞰東京鐵塔與都會天際線的代表性豪宅，配備24小時飯店式禮賓服務與專屬停車位。",
    "cases.c5.specs": "專有面積 245㎡ ｜ 3LDK 頂層",
    "cases.c6.tag": "住宿設施・京都東山",
    "cases.c6.title": "京都傳統町家活化住宿設施",
    "cases.c6.desc": "實際取得並進行合法住宿設施營運規劃，保留百年木構文化精髓並導入現代舒適設施與專業旅客接待系統。",
    "cases.c6.specs": "土地利用規劃 ｜ 民宿合法執照 ｜ 營運管理",
    "cases.c7.tag": "別墅自建・神奈川橫濱",
    "cases.c7.title": "橫濱港景自地自建海景住宅",
    "cases.c7.desc": "從土地取得評估、建築規劃設計到全流程營造自建，打造無可取代的海景自住居所。",
    "cases.c7.specs": "自地自建專案 ｜ 土地面積 350㎡ ｜ 永久產權",
    "cases.c8.tag": "收益公寓・東京新宿",
    "cases.c8.title": "新宿御苑收益型集合住宅",
    "cases.c8.desc": "緊鄰御苑綠地的優質收益型公寓，透過專業租賃管理與定期維護修繕，常年維持高稼動率。",
    "cases.c8.specs": "整棟 RC 5階建 ｜ 16戶 ｜ 租賃管理中",
    "cases.c9.tag": "莊園別墅・長野輕井澤",
    "cases.c9.title": "輕井澤森林度假別墅",
    "cases.c9.desc": "坐落於百年落葉松林間的四季度假宅邸，兼具自用休閒與非自住期間之託管收益潛力。",
    "cases.c9.specs": "敷地面積 850㎡ ｜ 溫泉引進 ｜ 4LDK",

    // News Page
    "news.title": "Yellow House - 最新消息 | 株式会社イエローハウスカンパニー",
    "news.banner.tag": "NEWS & UPDATES",
    "news.banner.h1": "最新消息與市場動態",
    "news.banner.desc": "株式会社イエローハウスカンパニー的最新業務進展、日本不動產市場洞察與實務專題分享。",
    "news.featured_label": "精選動態",
    "news.featured.date": "2026年3月",
    "news.featured.tag": "實務專題",
    "news.featured.title": "立足日本的在地實務夥伴：從取得、持有到營運的完整視角",
    "news.featured.desc": "我們不只介紹物件，更從買方、房東、投資人與經營者的多重視角，協助海外客戶全面評估日本不動產的實際價值、持有成本與營運風險。",
    "news.category.title": "分類",
    "news.category.all": "全部動態",
    "news.category.insights": "市場洞察",
    "news.category.market": "實務觀點",
    "news.category.corp": "公司公告",
    "news.category.media": "媒體報導",
    "news.read_more": "閱讀專題",


    // Contact Page (COMPANY INFORMATION 唯一依據)
    "contact.title": "Yellow House - 聯絡我們 | 株式会社イエローハウスカンパニー",
    "contact.banner.tag": "CONTACT US",
    "contact.banner.h1": "聯絡我們",
    "contact.banner.desc": "日本在地的實務不動產夥伴。無論您需要購置自住豪宅、投資收益型資產、租賃管理、自地自建或民宿營運諮詢，歡迎隨時與我們聯繫。",
    "contact.form.company": "公司／組織名稱 (選填)",
    "contact.form.name": "姓名",
    "contact.form.email": "電子郵件",
    "contact.form.phone": "聯絡電話 (選填)",
    "contact.form.type": "諮詢主要業務",
    "contact.form.type_placeholder": "請選擇業務項目",
    "contact.form.type_res": "01 不動產買賣仲介（住宅 / 自住）",
    "contact.form.type_com": "01 不動產買賣仲介（商業用 / 收益型）",
    "contact.form.type_mgmt": "02 不動產租賃及管理",
    "contact.form.type_resale": "03 不動產收購再販",
    "contact.form.type_dev": "04 土地開發及自地自建",
    "contact.form.type_hospitality": "05 住宿設施營運",
    "contact.form.type_other": "其他諮詢事項",
    "contact.form.message": "諮詢內容與需求",
    "contact.form.submit": "送出諮詢表單",
    "contact.form.submitting": "傳送中...",
    "contact.form.success": "諮詢已成功送出！我們將儘速與您聯繫",
    
    "contact.info.company_name_label": "公司名稱",
    "contact.info.company_name_val": "株式会社イエローハウスカンパニー\n(YELLOW HOUSE COMPANY)",
    "contact.info.hq_label": "公司地址",
    "contact.info.hq_val": "神奈川縣伊勢原市櫻台1-22-15\nネオハイツ伊勢原112 (〒259-1132)",
    "contact.info.license_label": "執照",
    "contact.info.license_val": "神奈川縣知事（1）第32070號",
    "contact.info.contact_label": "Email",
    "contact.info.contact_val": "contact@yellowhouse.jp",
    "contact.info.phone_label": "電話",
    "contact.info.phone_val": "-",
    "contact.info.hours_label": "營業時間",
    "contact.info.hours_val": "週一至週五 09:00 - 18:00 (JST)\n週末與日本國定假日可預約線上諮詢",
    "contact.quote": "「從取得、持有、管理、開發、營運到出售，以實際經驗協助客戶做出更完整的判斷。」",

    // Currency
    "currency.label": "貨幣",
    "currency.updated": "匯率更新時間",
    "currency.updated_cached": "匯率更新時間（離線快取）",
    "currency.unavailable": "匯率暫時無法取得，僅顯示日圓價格",
    "currency.approx": "約",
    "currency.disclaimer": "外幣金額為依最新可取得匯率換算之參考值，實際金額可能因匯率變動而異。",
    "price.label": "物件價格"
  },
  en: {
    // Nav
    "nav.home": "HOME",
    "nav.services": "SERVICES",
    "nav.company": "COMPANY",
    "nav.cases": "PORTFOLIO",
    "nav.properties": "PROPERTIES",
    "nav.news": "NEWS",
    "nav.contact": "CONTACT",
    "nav.menu": "Open menu",

    // Common CTA Banner
    "cta.title": "Begin Your Real Estate Journey in Japan",
    "cta.button": "SCHEDULE CONSULTATION",

    // Footer
    "footer.desc": "Based in Japan with an official Real Estate Brokerage License. Providing end-to-end practical advisory from brokerage, property management, and value-add resale to land development, bespoke builds, and hospitality operations.",
    "footer.nav": "NAVIGATION",
    "footer.location": "LOCATION",
    "footer.copyright": "© 2026 YELLOW HOUSE COMPANY Inc. (株式会社イエローハウスカンパニー). ALL RIGHTS RESERVED.",
    "footer.privacy": "PRIVACY POLICY",
    "footer.terms": "TERMS OF SERVICE",
    "footer.map_label": "Kanagawa HQ",
    "footer.social": "Social Media",

    // Home
    "home.title": "Yellow House - Your Practical Real Estate Partner in Japan | Yellow House Company Inc.",
    "home.hero.title_line1": "Your Practical Partner in",
    "home.hero.title_line2": "Japan Real Estate",
    "home.hero.desc": "We don't just introduce properties; we understand what it takes to own and operate them. From acquisition, holding, management, development, and operations to resale, our 15 years of hands-on experience empower you to make informed decisions.",
    "home.hero.consult": "BOOK CONSULTATION",
    "home.hero.view_properties": "EXPLORE BUSINESSES",
    "home.stat.experience_label": "EXPERIENCE",
    "home.stat.experience_val": "15 Years Track Record",
    "home.stat.certified_label": "CERTIFIED",
    "home.stat.certified_val": "Licensed Real Estate Broker",
    "home.stat.global_label": "GLOBAL",
    "home.stat.global_val": "Bilingual Advisory",
    "home.stat.license_label": "LICENSE",
    "home.stat.license_val": "Governor of Kanagawa (1) No. 32070",

    // Home - Focus Areas (06 Overseas Client Focus)
    "home.focus.tag": "OVERSEAS CLIENT FOCUS",
    "home.focus.title": "Two Core Directions for International Clients",
    "home.focus.desc": "Prioritizing European and North American clients, alongside investors from Taiwan and the greater Chinese-speaking world. We guide overseas buyers through the complete lifecycle from selection to eventual resale.",
    "home.focus1.num": "01",
    "home.focus1.tag": "PRIME RESIDENTIAL",
    "home.focus1.title": "Tokyo Prime Residential\n(JPY 100M+)",
    "home.focus1.desc": "Curating prime Tokyo residential estates that harmonize architectural quality, lifestyle comfort, and enduring capital preservation.",
    "home.focus1.cta": "EXPLORE RESIDENTIAL",
    "home.focus2.num": "02",
    "home.focus2.tag": "COMMERCIAL & INCOME",
    "home.focus2.title": "Commercial & Income-Generating\nProperty Investment",
    "home.focus2.desc": "Delivering rigorous yield calculations and asset structuring for investors seeking reliable cash flows and capital growth.",
    "home.focus2.cta": "EXPLORE INVESTMENT",

    // Home - Major Businesses (04 & 05)
    "home.services.tag": "CORE BUSINESSES",
    "home.services.title": "Our Core Business Scope",
    "home.services.desc": "Covering transactions, management, and value enhancement from land to full operations with comprehensive practical expertise.",
    
    // Business 1
    "home.biz1.num": "01",
    "home.biz1.title": "Real Estate Brokerage",
    "home.biz1.desc": "Acquisition and sale of residential estates, income-generating assets, commercial properties, and land.",
    "home.biz1.item1": "Property search & on-site due diligence",
    "home.biz1.item2": "Price & transaction terms negotiation",
    "home.biz1.item3": "Contract, closing & title registration coordination",

    // Business 2
    "home.biz2.num": "02",
    "home.biz2.title": "Leasing & Property Management",
    "home.biz2.desc": "Assisting landlords with day-to-day operations, tenant placement, and maintenance to safeguard steady returns.",
    "home.biz2.item1": "Tenant recruitment & lease administration",
    "home.biz2.item2": "Rent collection, move-outs & repair management",
    "home.biz2.item3": "Tenancy dispute resolution & legal compliance",

    // Business 3
    "home.biz3.num": "03",
    "home.biz3.title": "Property Acquisition & Value-Add Resale",
    "home.biz3.desc": "Enhancing asset value through strategic renovation and repurposing before repositioning in the market.",
    "home.biz3.item1": "Property acquisition & market valuation",
    "home.biz3.item2": "Architectural refurbishment & value enhancement",
    "home.biz3.item3": "Strategic repositioning & resale execution",

    // Business 4
    "home.biz4.num": "04",
    "home.biz4.title": "Land Development & Bespoke Construction",
    "home.biz4.desc": "Proven track record in site evaluation, land utilization planning, bespoke construction, and property development.",
    "home.biz4.item1": "Evaluating land value from zoning, design & yield angles",
    "home.biz4.item2": "Architectural planning tailored to market demands",
    "home.biz4.item3": "End-to-end custom build project management",

    // Business 5
    "home.biz5.num": "05",
    "home.biz5.title": "Hospitality & Accommodation Operations",
    "home.biz5.desc": "Hands-on experience in operating licensed vacation rentals and accommodation facilities from acquisition to daily guest hosting.",
    "home.biz5.item1": "Property acquisition & licensing compliance",
    "home.biz5.item2": "Facility setup & interior spatial planning",
    "home.biz5.item3": "Daily operational management & guest communications",

    // Home - Perspective (03 & 07)
    "home.perspective.tag": "OUR PERSPECTIVE",
    "home.perspective.title": "Standing from the Owner & Operator's Perspective",
    "home.perspective.desc": "Our distinction lies in combining brokerage expertise with real-world experience as landlords, investors, property managers, developers, and hospitality operators. We prioritize whether an asset truly serves your ownership goals over merely closing a deal.",
    "home.perspective.item1_title": "Intrinsic Asset Value",
    "home.perspective.item1_desc": "Evaluating location, structural integrity, legal rights, and market conditions.",
    "home.perspective.item2_title": "Real Holding Costs",
    "home.perspective.item2_desc": "Factoring in taxes, management fees, repair reserves, and financing costs.",
    "home.perspective.item3_title": "Leasing & Operating Risks",
    "home.perspective.item3_desc": "Assessing tenant quality, vacancy risk, cash flow stability, and operational friction.",
    "home.perspective.item4_title": "Maintenance & Aging Dynamics",
    "home.perspective.item4_desc": "Understanding building depreciation, equipment upkeep, and daily management burdens.",
    "home.perspective.item5_title": "Land Utilization & Development",
    "home.perspective.item5_desc": "Analyzing zoning allowances, architectural potential, and future upside.",
    "home.perspective.item6_title": "Exit Strategy & Resale Liquidity",
    "home.perspective.item6_desc": "Evaluating secondary market liquidity, future buyer profiles, and tax implications before acquisition.",

    // Home - Advisor Profile (02)
    "home.advisor.tag": "REPRESENTATIVE",
    "home.advisor.title": "15 Years of Practical Experience\nRooted in Every Stage of Real Estate",
    "home.advisor.name": "Kei-Yu Huang",
    "home.advisor.role": "Representative ｜ Landlord ｜ Real Estate Investor",
    "home.advisor.desc": "Accumulating approximately 15 years of hands-on real estate practice in Japan. Directly engaged in acquisitions, leasing management, renovations, brokerage, bespoke developments, land planning, and hospitality facility operations. We evaluate properties through the lens of actual ownership and operational success, never just transactional closing.",
    "home.advisor.cta": "VIEW COMPANY PROFILE",

    // Home - Process (06)
    "home.process.tag": "WORKFLOW",
    "home.process.title": "Complete 6-Step Service Workflow",
    "home.process.desc": "Leveraging deep local Japan experience to support overseas clients through every phase from selection to profitable exit.",
    "home.process.step1.title": "Property Selection",
    "home.process.step1.desc": "Carefully curating assets aligned with your residential standards or investment targets.",
    "home.process.step2.title": "Investigation & Due Diligence",
    "home.process.step2.desc": "Conducting on-site surveys, structural audits, legal checks, and full cost assessments.",
    "home.process.step3.title": "Contract & Negotiation",
    "home.process.step3.desc": "Negotiating optimal terms and providing clear, legally compliant bilingual contract reviews.",
    "home.process.step4.title": "Settlement & Closing",
    "home.process.step4.desc": "Coordinating fund transfers, official title registration, and formal key handover.",
    "home.process.step5.title": "Post-Purchase Management",
    "home.process.step5.desc": "Handling tenant leasing, regular maintenance, repair management, and financial accounting.",
    "home.process.step6.title": "Future Exit & Resale",
    "home.process.step6.desc": "Assessing market liquidity and tax implications to facilitate timely, profitable divestment.",
    "home.process.cta": "EXPLORE ALL SERVICES",

    // Services Page
    "services.title": "Yellow House - Services | Yellow House Company Inc.",
    "services.banner.tag": "SERVICES",
    "services.banner.h1": "Core Businesses & Services",
    "services.banner.desc": "Encompassing transactions, management, and value creation. From acquisition, holding, management, development, and operations to resale, our hands-on experience empowers you to make informed decisions.",
    "services.tag1": "Real Estate Brokerage",
    "services.tag2": "Leasing & Property Management",
    "services.tag3": "Property Acquisition & Resale",
    "services.tag4": "Land Development & Builds",
    "services.tag5": "Hospitality Operations",
    "services.tag6": "Cross-Border Advisory",
    "services.flagA.tag": "Overseas Client Direction I",
    "services.flagA.box_title": "Tokyo Prime Residential (JPY 100M+)",
    "services.flagA.box_desc": "Prioritizing international and cross-border buyers seeking trophy residences with enduring value and premier living environments.",
    "services.flagA.desc": "Viewing every property from the owner-occupier standpoint, we analyze neighborhood amenities, school districts, craftsmanship, and long-term liquidity. We provide end-to-end guidance from search and diligence to post-handover support.",
    "services.flagB.tag": "Overseas Client Direction II",
    "services.flagB.box_title": "Commercial & Income-Generating Investment",
    "services.flagB.box_desc": "Encompassing office buildings, retail assets, and multi-family residential complexes evaluated with realistic holding yields.",
    "services.flagB.desc": "Looking beyond superficial headline yields, we incorporate taxes, management fees, repair reserves, vacancy buffers, and future exit liquidity into comprehensive financial models.",
    "services.steps.title": "Comprehensive Workflow",
    "services.flow.title": "SERVICE FLOW",
    "services.taxes.title": "Associated Costs & Taxes Summary",
    "services.taxes.buy_label": "Upon Purchase",
    "services.taxes.buy_val": "Brokerage Fee / Property Acquisition Tax / Stamp Duty / Registration Tax / Prorated Fixed Asset Tax",
    "services.taxes.hold_label": "Holding Period",
    "services.taxes.hold_val": "Fixed Asset Tax / City Planning Tax / Building Management Fee / Repair Reserve / Income Tax Filing",
    "services.taxes.sell_label": "Upon Sale",
    "services.taxes.sell_val": "Capital Gains Tax / Brokerage Commission / Registration Fees",
    "services.mgmt.title": "Leasing & Property Management Operations",
    "services.mgmt.desc": "Assisting owners with tenant placement, rent collection, and repairs. Our hands-on landlord experience ensures your Japanese property is managed with complete peace of mind.",
    "services.mgmt.item1": "Tenant recruitment & strict background verification",
    "services.mgmt.item2": "Rent collection, overseas remittance & financial reporting",
    "services.mgmt.item3": "Preventative building upkeep, equipment repairs & burden mitigation",
    "services.mgmt.item4": "Dispute mediation, move-out inspections & restoration oversight",
    "services.cta.title": "Discuss Your Japanese Real Estate Strategy",
    "services.cta.btn": "SCHEDULE CONSULTATION",

    // Company Page (COMPANY INFORMATION 唯一依據)
    "company.title": "Yellow House - Company Profile | Yellow House Company Inc.",
    "company.banner.tag": "COMPANY PROFILE",
    "company.banner.h1": "Your Practical Real Estate Partner in Japan",
    "company.banner.desc": "From acquisition, holding, management, development, and operations to resale, our hands-on experience empowers you to make informed decisions.",
    "company.rep.tag": "REPRESENTATIVE PROFILE",
    "company.rep.headline": "15 Years of Practical Experience,\nRooted in Every Single Stage.",
    "company.rep.p1": "Yellow House Company Inc. (株式会社イエローハウスカンパニー) is a licensed Japanese real estate corporation holding an official Real Estate Brokerage License. We don't just introduce properties; we deeply understand what it takes to own and operate them.",
    "company.rep.p2": "From the multi-faceted perspectives of buyers, landlords, investors, and operators, we assist clients in evaluating true asset value, total cost of ownership, and operational risks. Our goal is never just closing a transaction, but confirming whether an asset is genuinely suited for long-term ownership and operation.",
    "company.overview.tag": "COMPANY INFORMATION",
    "company.overview.title": "Corporate Overview",
    "company.overview.name_label": "Company Name",
    "company.overview.name_val": "Yellow House Company Inc. (株式会社イエローハウスカンパニー)",
    "company.overview.rep_label": "Representative",
    "company.overview.rep_val": "Kei-Yu Huang (Representative Director ｜ Landlord ｜ Investor)",
    "company.overview.lic_label": "License Number",
    "company.overview.lic_val": "Governor of Kanagawa (1) No. 32070",
    "company.overview.biz_label": "Core Businesses",
    "company.overview.biz_val1": "Real Estate Brokerage, Leasing Management, Value-Add Resale",
    "company.overview.biz_val2": "Land Development, Bespoke Construction, Hospitality Operations",
    "company.overview.biz_val3": "Cross-Border Real Estate Advisory & Comprehensive Support",
    "company.overview.loc_label": "Address",
    "company.overview.loc_val": "#112 Neo Heights Isehara, 1-22-15 Sakuradai,\nIsehara-shi, Kanagawa 259-1132, Japan",
    "company.quote": "“Not merely closing transactions, but confirming whether an asset is truly suited for actual ownership and operations.”",
    "company.quote_desc": "Our distinction lies in standing firmly in the shoes of actual property owners. Beyond agency brokerage, our direct experience in holding, managing, developing, and operating real estate ensures you receive the most practical, objective guidance.",
    "company.visit.tag": "OUR OFFICE",
    "company.visit.title": "Kanagawa Headquarters",
    "company.visit.btn": "OPEN GOOGLE MAPS",

    // Cases Page
    "cases.title": "Yellow House - Case Studies",
    "cases.banner.tag": "PORTFOLIO",
    "cases.banner.h1": "Selected Portfolio & Case Studies",
    "cases.banner.desc": "Spanning prime residential homes, commercial office buildings, land developments, and hospitality assets—demonstrating our deep practical track record across acquisitions, management, and operations.",
    "cases.filter.all": "ALL PROJECTS",
    "cases.filter.res": "RESIDENTIAL",
    "cases.filter.com": "COMMERCIAL & INCOME",
    "cases.card.view_detail": "VIEW DETAILS",
    "cases.card.inquire": "INQUIRE PROPERTY",
    "cases.c1.tag": "PRIME RESIDENTIAL・TOKYO MINATO",
    "cases.c1.title": "Minato Sky View Penthouse Sanctuary",
    "cases.c1.desc": "Prime residential estate in central Tokyo featuring panoramic skyline views, exceptional building specs, and full concierge management.",
    "cases.c1.specs": "Floor Area 182㎡ ｜ 3LDK ｜ Freehold",
    "cases.c2.tag": "INCOME COMMERCIAL・TOKYO SHIBUYA",
    "cases.c2.title": "Shibuya Core Commercial Office Building",
    "cases.c2.desc": "Fully-leased commercial office asset in central Shibuya generating strong cash flows, with optimized leasing structures and building management.",
    "cases.c2.specs": "Whole Building RC 6-Story ｜ 100% Leased ｜ Freehold",
    "cases.c3.tag": "BOUTIQUE RESIDENCE・TOKYO SHIBUYA",
    "cases.c3.title": "Shibuya Quiet Enclave Detached Residence",
    "cases.c3.desc": "Bespoke detached residence harmonizing modernist Japanese aesthetics and private landscaped gardens in an exclusive residential enclave.",
    "cases.c3.specs": "Site 210㎡ ｜ Floor 260㎡ ｜ 4LDK",
    "cases.c4.tag": "RETAIL COMMERCIAL・TOKYO CHUO",
    "cases.c4.title": "Chuo District Prime Corner Commercial Asset",
    "cases.c4.desc": "High-footfall corner retail property offering supreme brand visibility, defensive valuation, and long-term secure corporate leases.",
    "cases.c4.specs": "Whole Building 4-Story ｜ Commercial Core ｜ Freehold",
    "cases.c5.tag": "PRIME RESIDENTIAL・TOKYO MINATO",
    "cases.c5.title": "Roppongi Skyline Panoramic Penthouse",
    "cases.c5.desc": "Trophy residential penthouse overlooking Tokyo Tower with 24-hour hotel-grade concierge services and private parking.",
    "cases.c5.specs": "Floor Area 245㎡ ｜ 3LDK Duplex",
    "cases.c6.tag": "HOSPITALITY・KYOTO HIGASHIYAMA",
    "cases.c6.title": "Kyoto Century Machiya Heritage Hospitality Facility",
    "cases.c6.desc": "Acquisition and full licensing for traditional Kyoto machiya hospitality operations, blending heritage carpentry with modern amenities.",
    "cases.c6.specs": "Land Planning ｜ Licensed Minpaku ｜ Operations",
    "cases.c7.tag": "BESPOKE BUILD・KANAGAWA YOKOHAMA",
    "cases.c7.title": "Yokohama Bay View Bespoke Residence",
    "cases.c7.desc": "Comprehensive project management from site acquisition and architectural design to full custom construction overlooking Yokohama port.",
    "cases.c7.specs": "Bespoke Build ｜ Site 350㎡ ｜ Freehold",
    "cases.c8.tag": "INCOME MULTI-FAMILY・TOKYO SHINJUKU",
    "cases.c8.title": "Shinjuku Gyoen Income-Generating Multi-Family Tower",
    "cases.c8.desc": "Boutique residential apartment building adjacent to Gyoen parklands, maintaining high occupancy through proactive asset management.",
    "cases.c8.specs": "Whole Building RC 5-Story ｜ 16 Units ｜ Managed",
    "cases.c9.tag": "FOREST RETREAT・NAGANO KARUIZAWA",
    "cases.c9.title": "Old Karuizawa Four-Season Forest Villa",
    "cases.c9.desc": "Secluded four-season villa nestled among centenary larches, offering year-round personal retreat alongside flexible hospitality hosting.",
    "cases.c9.specs": "Site 850㎡ ｜ Natural Onsen ｜ 4LDK",

    // News Page
    "news.title": "Yellow House - Press & News | Yellow House Company Inc.",
    "news.banner.tag": "NEWS & UPDATES",
    "news.banner.h1": "News & Market Updates",
    "news.banner.desc": "Latest corporate announcements, Japan real estate market insights, and practical advisory topics from Yellow House Company.",
    "news.featured_label": "FEATURED TOPIC",
    "news.featured.date": "MARCH 2026",
    "news.featured.tag": "PRACTICAL ADVISORY",
    "news.featured.title": "Your Practical Partner in Japan: A Comprehensive Perspective from Acquisition to Operations",
    "news.featured.desc": "We don't just broker transactions; we evaluate properties from the combined perspectives of buyers, landlords, investors, and operators—assessing genuine value, holding costs, and operating risks.",
    "news.category.title": "CATEGORIES",
    "news.category.all": "All Updates",
    "news.category.insights": "Market Insights",
    "news.category.market": "Practical Views",
    "news.category.corp": "Company News",
    "news.category.media": "Media Coverage",
    "news.read_more": "READ TOPIC",


    // Contact Page (COMPANY INFORMATION 唯一依據)
    "contact.title": "Yellow House - Contact | Yellow House Company Inc.",
    "contact.banner.tag": "CONTACT US",
    "contact.banner.h1": "Contact Us",
    "contact.banner.desc": "Your practical real estate partner in Japan. Whether you are seeking prime residential estates, commercial investments, leasing management, custom builds, or hospitality operations, we are here to assist.",
    "contact.form.company": "Company / Organization (Optional)",
    "contact.form.name": "Full Name",
    "contact.form.email": "Email Address",
    "contact.form.phone": "Phone Number (Optional)",
    "contact.form.type": "Inquiry Topic",
    "contact.form.type_placeholder": "Select Core Business",
    "contact.form.type_res": "01 Real Estate Brokerage (Residential / Prime)",
    "contact.form.type_com": "01 Real Estate Brokerage (Commercial / Income)",
    "contact.form.type_mgmt": "02 Leasing & Property Management",
    "contact.form.type_resale": "03 Property Acquisition & Resale",
    "contact.form.type_dev": "04 Land Development & Bespoke Construction",
    "contact.form.type_hospitality": "05 Hospitality Facility Operations",
    "contact.form.type_other": "Other Inquiries",
    "contact.form.message": "Message / Details",
    "contact.form.submit": "SUBMIT INQUIRY",
    "contact.form.submitting": "SENDING...",
    "contact.form.success": "Inquiry submitted successfully. Our team will contact you shortly.",
    
    "contact.info.company_name_label": "COMPANY NAME",
    "contact.info.company_name_val": "Yellow House Company Inc.\n(株式会社イエローハウスカンパニー)",
    "contact.info.rep_label": "REPRESENTATIVE",
    "contact.info.rep_val": "Kei-Yu Huang (Representative Director)",
    "contact.info.hq_label": "ADDRESS",
    "contact.info.hq_val": "#112 Neo Heights Isehara, 1-22-15 Sakuradai,\nIsehara-shi, Kanagawa 259-1132, Japan",
    "contact.info.license_label": "LICENSE",
    "contact.info.license_val": "Governor of Kanagawa (1) No. 32070",
    "contact.info.scope_label": "CORE BUSINESSES",
    "contact.info.scope_val": "Real Estate Brokerage, Leasing Management, Repurchase & Resale, Land Development, Bespoke Construction, Hospitality Operations",
    "contact.info.contact_label": "EMAIL",
    "contact.info.contact_val": "contact@yellowhouse.jp",
    "contact.info.hours_label": "OFFICE HOURS",
    "contact.info.hours_val": "Mon - Fri 09:00 - 18:00 (JST)\nOnline consultations available on weekends by appointment",
    "contact.quote": "“From acquisition, holding, management, development, and operations to resale, our hands-on experience empowers you to make informed decisions.”",

    // Currency
    "currency.label": "Currency",
    "currency.updated": "Exchange rate updated",
    "currency.updated_cached": "Exchange rate updated (cached offline)",
    "currency.unavailable": "Exchange rate temporarily unavailable — showing JPY only",
    "currency.approx": "Approx.",
    "currency.disclaimer": "Amounts in other currencies are approximate conversions based on the latest available exchange rate and may vary with market fluctuations.",
    "price.label": "PROPERTY PRICE"
  },
  jp: {
    // Nav
    "nav.home": "ホーム",
    "nav.services": "サービス",
    "nav.company": "会社案内",
    "nav.cases": "実績紹介",
    "nav.properties": "販売物件",
    "nav.news": "ニュース",
    "nav.contact": "お問い合わせ",
    "nav.menu": "メニューを開く",

    // Common CTA Banner
    "cta.title": "日本での不動産取引を、私たちと共に",
    "cta.button": "無料相談を予約する",

    // Footer
    "footer.desc": "日本国内で宅地建物取引業の正式な免許を取得し、売買仲介から賃貸管理、買取再販、土地開発、注文建築、宿泊施設運営まで、実務に基づいた総合的な不動産サポートを提供しています。",
    "footer.nav": "サイトマップ",
    "footer.location": "所在地",
    "footer.copyright": "© 2026 株式会社イエローハウスカンパニー（YELLOW HOUSE COMPANY）ALL RIGHTS RESERVED.",
    "footer.privacy": "プライバシーポリシー",
    "footer.terms": "利用規約",
    "footer.map_label": "神奈川本社",
    "footer.social": "ソーシャルメディア",

    // Home
    "home.title": "Yellow House - 日本の不動産を実務目線でサポート | 株式会社イエローハウスカンパニー",
    "home.hero.title_line1": "日本に根差した",
    "home.hero.title_line2": "不動産実務パートナー",
    "home.hero.desc": "私たちは物件をご紹介するだけではなく、所有と経営の実態を理解しています。取得、保有、管理、開発、運営から売却まで、15年の実務経験でお客様の的確な判断をサポートします。",
    "home.hero.consult": "相談を予約する",
    "home.hero.view_properties": "事業内容を見る",
    "home.stat.experience_label": "EXPERIENCE",
    "home.stat.experience_val": "15年の実務経験",
    "home.stat.certified_label": "CERTIFIED",
    "home.stat.certified_val": "宅地建物取引業免許取得済み",
    "home.stat.global_label": "GLOBAL",
    "home.stat.global_val": "多言語対応サービス",
    "home.stat.license_label": "LICENSE",
    "home.stat.license_val": "神奈川県知事（1）第32070号",

    // Home - Focus Areas (06 Overseas Client Focus)
    "home.focus.tag": "OVERSEAS CLIENT FOCUS",
    "home.focus.title": "海外のお客様に向けた2つの注力分野",
    "home.focus.desc": "欧米圏のお客様、そして台湾をはじめとする中華圏の投資家の皆様を主な対象に、物件選びから将来の売却まで、海外オーナー様の不動産取得を一貫してサポートします。",
    "home.focus1.num": "01",
    "home.focus1.tag": "PRIME RESIDENTIAL",
    "home.focus1.title": "東京都心の高級レジデンス\n（1億円以上）",
    "home.focus1.desc": "建築品質、住環境の快適性、そして資産価値の持続性を兼ね備えた東京都心の高級レジデンスを厳選してご紹介します。",
    "home.focus1.cta": "レジデンスを見る",
    "home.focus2.num": "02",
    "home.focus2.tag": "COMMERCIAL & INCOME",
    "home.focus2.title": "商業用及び収益不動産への\n投資",
    "home.focus2.desc": "安定したキャッシュフローと資産価値の向上を求める投資家の皆様に、精緻な収益計算と資産構成のご提案を行います。",
    "home.focus2.cta": "投資物件を見る",

    // Home - Major Businesses (04 & 05)
    "home.services.tag": "CORE BUSINESSES",
    "home.services.title": "主要事業内容",
    "home.services.desc": "土地から運営まで、取引・管理・価値向上を網羅する豊富な実務経験を有しています。",

    // Business 1
    "home.biz1.num": "01",
    "home.biz1.title": "不動産売買仲介",
    "home.biz1.desc": "居住用不動産、収益不動産、商業用不動産及び土地の売買を仲介します。",
    "home.biz1.item1": "物件探索及び現地調査",
    "home.biz1.item2": "価格及び取引条件の交渉",
    "home.biz1.item3": "契約、引き渡し及び登記手続きの調整",

    // Business 2
    "home.biz2.num": "02",
    "home.biz2.title": "賃貸及び物件管理",
    "home.biz2.desc": "オーナー様の日常管理、入居者募集及び修繕業務をサポートし、安定した収益の維持に努めます。",
    "home.biz2.item1": "入居者募集及び賃貸借契約管理",
    "home.biz2.item2": "賃料収受、退去対応及び修繕手配",
    "home.biz2.item3": "賃貸トラブル対応及び法令遵守",

    // Business 3
    "home.biz3.num": "03",
    "home.biz3.title": "不動産買取再販",
    "home.biz3.desc": "市場動向と活用方法を見極め、物件の価値を高めたうえで再販します。",
    "home.biz3.item1": "物件の買取及び市場価値の査定",
    "home.biz3.item2": "リノベーションによる価値向上",
    "home.biz3.item3": "再ポジショニング及び売却の実行",

    // Business 4
    "home.biz4.num": "04",
    "home.biz4.title": "土地開発及び注文建築",
    "home.biz4.desc": "土地評価、土地活用計画、注文建築及び土地開発における豊富な実績を有しています。",
    "home.biz4.item1": "用途、建築計画及び将来収益の観点からの土地価値評価",
    "home.biz4.item2": "土地活用計画及び建築法規の確認",
    "home.biz4.item3": "注文建築プロジェクトの一貫した企画・実行",

    // Business 5
    "home.biz5.num": "05",
    "home.biz5.title": "宿泊施設運営",
    "home.biz5.desc": "民泊及び宿泊施設の運営を自ら手掛け、物件取得から日常運営まで実務経験を有しています。",
    "home.biz5.item1": "物件取得及び関連許認可の取得",
    "home.biz5.item2": "施設設備及び客室仕様の企画",
    "home.biz5.item3": "日常運営管理及び多言語での宿泊者対応",

    // Home - Perspective (03 & 07)
    "home.perspective.tag": "OUR PERSPECTIVE",
    "home.perspective.title": "実際の所有者・運営者の視点に立って",
    "home.perspective.desc": "私たちの強みは、仲介実務にとどまらず、オーナー、投資家、管理者、開発者、そして運営者としての経験を兼ね備えている点にあります。取引を成立させることよりも、その不動産がお客様の目的に本当に適しているかを重視しています。",
    "home.perspective.item1_title": "物件そのものの価値",
    "home.perspective.item1_desc": "立地、建物の状態、権利関係及び市場動向を確認します。",
    "home.perspective.item2_title": "実際の保有コスト",
    "home.perspective.item2_desc": "税金、管理費、修繕積立金及び資金調達コストを踏まえて判断します。",
    "home.perspective.item3_title": "賃貸及び運営リスク",
    "home.perspective.item3_desc": "入居者の質、空室リスク、収益及び運営の安定性を評価します。",
    "home.perspective.item4_title": "修繕及び管理上の課題",
    "home.perspective.item4_desc": "建物の経年劣化、設備及び日常管理の負担を把握します。",
    "home.perspective.item5_title": "土地活用及び開発",
    "home.perspective.item5_desc": "用途地域、建築の可能性及び将来性を見極めます。",
    "home.perspective.item6_title": "売却及び出口戦略",
    "home.perspective.item6_desc": "取得前の段階から流動性、税務及び将来の買い手を見据えて検討します。",

    // Home - Advisor Profile (02)
    "home.advisor.tag": "REPRESENTATIVE",
    "home.advisor.title": "15年の不動産実務、\nすべての工程に自ら携わってきた経験",
    "home.advisor.name": "黄経祐",
    "home.advisor.role": "代表者｜オーナー｜不動産投資家",
    "home.advisor.desc": "日本国内で約15年にわたり不動産実務に携わってきました。物件取得、賃貸管理及び修繕、不動産仲介、注文建築プロジェクト、土地評価、活用計画及び開発、そして宿泊施設の取得・運営まで、あらゆる現場を自ら経験しています。仲介成約の視点だけでなく、実際の保有と経営の結果から物件を見極めます。",
    "home.advisor.cta": "詳しいプロフィールを見る",

    // Home - Process (06)
    "home.process.tag": "WORKFLOW",
    "home.process.title": "6つのステップによる一貫したサービス",
    "home.process.desc": "日本国内での豊富な実務経験を活かし、物件選びから売却まで、海外のお客様を一貫してサポートします。",
    "home.process.step1.title": "物件選定",
    "home.process.step1.desc": "自己居住または投資目的に応じ、実際の保有価値に見合った優良物件を厳選します。",
    "home.process.step2.title": "調査・デューデリジェンス",
    "home.process.step2.desc": "立地、建物状況、権利関係及び保有コスト、修繕履歴を詳細に調査します。",
    "home.process.step3.title": "契約・交渉",
    "home.process.step3.desc": "価格及び取引条件を専門的に交渉し、明快で法令に準拠した契約内容をご説明します。",
    "home.process.step4.title": "決済・引き渡し",
    "home.process.step4.desc": "資金決済、所有権移転登記及び物件の引き渡しなど、法定手続きを調整します。",
    "home.process.step5.title": "購入後の管理",
    "home.process.step5.desc": "入居者募集、日常修繕、運営維持及び収支管理まで対応し、海外からの資産保有を安心なものにします。",
    "home.process.step6.title": "将来の売却",
    "home.process.step6.desc": "市場流動性及び税務面を事前に見極め、最適なタイミングでの売却をサポートします。",
    "home.process.cta": "サービス内容を詳しく見る",

    // Services Page
    "services.title": "Yellow House - サービス内容 | 株式会社イエローハウスカンパニー",
    "services.banner.tag": "SERVICES",
    "services.banner.h1": "主要事業及びサービス内容",
    "services.banner.desc": "取引、管理及び価値向上を網羅する事業を展開しています。取得、保有、管理、開発、運営から売却まで、実務経験に基づきお客様の判断をサポートします。",
    "services.tag1": "不動産売買仲介",
    "services.tag2": "賃貸及び物件管理",
    "services.tag3": "不動産買取再販",
    "services.tag4": "土地開発及び注文建築",
    "services.tag5": "宿泊施設運営",
    "services.tag6": "海外顧客向け不動産コンサルティング",
    "services.flagA.tag": "海外のお客様への注力分野 I",
    "services.flagA.box_title": "東京都心の高級レジデンス（1億円以上）",
    "services.flagA.box_desc": "資産価値の持続性と上質な住環境を求める海外及び国境を越えたお客様を主な対象としています。",
    "services.flagA.desc": "実際に住まう方の視点であらゆる物件を見極め、周辺環境、学区、施工品質及び将来の流動性まで分析します。物件探しからデューデリジェンス、引き渡し後のサポートまで一貫してご案内します。",
    "services.flagB.tag": "海外のお客様への注力分野 II",
    "services.flagB.box_title": "商業用及び収益不動産への投資",
    "services.flagB.box_desc": "オフィスビル、店舗物件及び集合住宅を対象に、現実的な保有利回りに基づいて評価します。",
    "services.flagB.desc": "表面利回りだけにとらわれず、税金、管理費、修繕積立金、空室リスク及び将来の出口における流動性まで踏まえた総合的な収支計画をご提示します。",
    "services.steps.title": "取得から保有までの一貫したフロー",
    "services.flow.title": "SERVICE FLOW",
    "services.taxes.title": "関連費用及び税金の概要",
    "services.taxes.buy_label": "購入時",
    "services.taxes.buy_val": "仲介手数料／不動産取得税／印紙税／登録免許税／固定資産税・都市計画税の精算",
    "services.taxes.hold_label": "保有期間中",
    "services.taxes.hold_val": "固定資産税／都市計画税／管理費／修繕積立金／所得税の申告",
    "services.taxes.sell_label": "売却時",
    "services.taxes.sell_val": "譲渡所得税／仲介手数料／登記費用",
    "services.mgmt.title": "賃貸及び日常管理業務",
    "services.mgmt.desc": "オーナー様の入居者募集、賃料収受及び修繕対応をサポートします。オーナー及び運営者としての実務経験により、海外にいらっしゃるお客様にも安心して日本の資産を保有いただけます。",
    "services.mgmt.item1": "入居者募集及び賃貸借契約管理（入居審査を厳格に実施）",
    "services.mgmt.item2": "賃料収受、海外送金及び収支明細管理",
    "services.mgmt.item3": "建物経年劣化への対応、設備修繕及び日常管理負担の軽減",
    "services.mgmt.item4": "賃貸トラブル対応、退去立会い及び原状回復の管理",
    "services.cta.title": "日本の不動産戦略についてご相談ください",
    "services.cta.btn": "専門相談を予約する",

    // Company Page (COMPANY INFORMATION 唯一依據)
    "company.title": "Yellow House - 会社案内 | 株式会社イエローハウスカンパニー",
    "company.banner.tag": "COMPANY PROFILE",
    "company.banner.h1": "日本に根差した不動産実務パートナー",
    "company.banner.desc": "取得、保有、管理、開発、運営から売却まで、実務経験に基づきお客様の的確な判断をサポートします。",
    "company.rep.tag": "代表者プロフィール",
    "company.rep.headline": "15年の不動産実務、\nすべての工程に自ら携わってきた経験。",
    "company.rep.p1": "株式会社イエローハウスカンパニーは、日本国内で宅地建物取引業の正式な免許を取得した不動産会社です。私たちは物件をご紹介するだけでなく、所有と経営の実態を深く理解しています。",
    "company.rep.p2": "買主、オーナー、投資家及び運営者、それぞれの視点から、物件の価値、コスト及びリスクをお客様と共に見極めます。取引の成立のみを目的とせず、その物件が実際の保有及び経営に適しているかを確認することを大切にしています。",
    "company.overview.tag": "COMPANY INFORMATION",
    "company.overview.title": "会社概要",
    "company.overview.name_label": "会社名",
    "company.overview.name_val": "株式会社イエローハウスカンパニー（YELLOW HOUSE COMPANY）",
    "company.overview.rep_label": "代表者",
    "company.overview.rep_val": "黄経祐（代表取締役｜オーナー｜投資家）",
    "company.overview.lic_label": "免許番号",
    "company.overview.lic_val": "神奈川県知事（1）第32070号",
    "company.overview.biz_label": "主要事業",
    "company.overview.biz_val1": "不動産売買仲介、賃貸管理、収益不動産の買取再販",
    "company.overview.biz_val2": "土地開発、注文建築、宿泊施設運営",
    "company.overview.biz_val3": "海外のお客様向け不動産コンサルティング及び総合サポート",
    "company.overview.loc_label": "所在地",
    "company.overview.loc_val": "〒259-1132\n神奈川県伊勢原市桜台1-22-15\nネオハイツ伊勢原112",
    "company.quote": "「取引の成立のみを目的とせず、\nその物件が実際の保有及び経営に適しているかを確認する。」",
    "company.quote_desc": "私たちの強みは、実際の所有者としての視点に立っていることです。仲介実務にとどまらず、オーナー、投資家、管理者及び運営者としての経験を活かし、最も実務的な判断材料をご提供します。",
    "company.visit.tag": "OUR OFFICE",
    "company.visit.title": "神奈川本社",
    "company.visit.btn": "Googleマップで見る",

    // Cases Page
    "cases.title": "Yellow House - 実績紹介",
    "cases.banner.tag": "PORTFOLIO",
    "cases.banner.h1": "実績紹介及び厳選プロジェクト",
    "cases.banner.desc": "高級居住用不動産、収益商業ビル、土地開発及び宿泊施設まで、売買、管理、リノベーション及び運営における豊富な実務実績をご紹介します。",
    "cases.filter.all": "すべての実績",
    "cases.filter.res": "居住用・自己居住",
    "cases.filter.com": "商業用・収益型",
    "cases.card.view_detail": "詳細を見る",
    "cases.card.inquire": "この物件について問い合わせる",
    "cases.c1.tag": "高級レジデンス・東京都港区",
    "cases.c1.title": "港区 眺望を誇る高層レジデンス",
    "cases.c1.desc": "東京中心部に位置する高級居住用不動産。優れた建物品質、希少な立地及び充実した物件管理により、海外のお客様に極上の住環境を提供します。",
    "cases.c1.specs": "専有面積182㎡｜3LDK｜所有権",
    "cases.c2.tag": "収益商業ビル・東京都渋谷区",
    "cases.c2.title": "渋谷中心部の収益型商業ビル",
    "cases.c2.desc": "満室稼働中の中心部商業ビル。安定した長期賃料収入を確保し、収益構造の再編及び管理体制の最適化により堅実な年間利回りを実現しています。",
    "cases.c2.specs": "一棟RC造6階建｜満室稼働中｜所有権",
    "cases.c3.tag": "高級レジデンス・東京都渋谷区",
    "cases.c3.title": "渋谷区 閑静な住宅街の邸宅",
    "cases.c3.desc": "現代和風建築の美意識と緑豊かな庭園を融合させた高級居住用邸宅。都心の利便性と高いプライバシー性を兼ね備えています。",
    "cases.c3.specs": "敷地面積210㎡｜建物面積260㎡｜4LDK",
    "cases.c4.tag": "商業旗艦店舗・東京都中央区",
    "cases.c4.title": "中央区 商業街区の角地旗艦店舗",
    "cases.c4.desc": "人通りの多い商業中心地に位置し、優れたブランド訴求力と資産価値の安定性を備え、長期にわたる安定した賃料収入を確保しています。",
    "cases.c4.specs": "一棟4階建｜商業中心地｜所有権",
    "cases.c5.tag": "高級レジデンス・東京都港区",
    "cases.c5.title": "六本木 パノラマビューのペントハウス",
    "cases.c5.desc": "東京タワー及び都心の街並みを一望する象徴的な邸宅。24時間対応のホテル水準のコンシェルジュサービスと専用駐車場を備えています。",
    "cases.c5.specs": "専有面積245㎡｜3LDKメゾネット",
    "cases.c6.tag": "宿泊施設・京都市東山区",
    "cases.c6.title": "京都 伝統町家を活用した宿泊施設",
    "cases.c6.desc": "物件を取得し、合法的な宿泊施設として運営計画を立案。百年を超える木造建築の趣を保ちながら、現代的な快適設備と多言語対応の接客体制を導入しています。",
    "cases.c6.specs": "土地活用計画｜民泊許可取得済み｜運営管理",
    "cases.c7.tag": "注文建築・神奈川県横浜市",
    "cases.c7.title": "横浜 港を望む注文建築の邸宅",
    "cases.c7.desc": "土地取得の評価、建築設計から施工まで一貫してプロデュース。他に代えがたい海の眺望を誇る自己居住用邸宅を実現しました。",
    "cases.c7.specs": "注文建築プロジェクト｜敷地面積350㎡｜所有権",
    "cases.c8.tag": "収益マンション・東京都新宿区",
    "cases.c8.title": "新宿御苑近接の収益型集合住宅",
    "cases.c8.desc": "新宿御苑の緑地に隣接する優良な収益型マンション。専門的な賃貸管理と定期的な修繕により、年間を通じて高い入居率を維持しています。",
    "cases.c8.specs": "一棟RC造5階建｜16戸｜賃貸管理中",
    "cases.c9.tag": "別荘・長野県軽井沢町",
    "cases.c9.title": "軽井沢 森に佇む四季の別荘",
    "cases.c9.desc": "樹齢百年を超えるカラマツ林に囲まれた四季を楽しめる別荘。自己利用のほか、不在時には宿泊施設としての運用収益も見込めます。",
    "cases.c9.specs": "敷地面積850㎡｜温泉引き込み｜4LDK",

    // News Page
    "news.title": "Yellow House - ニュース | 株式会社イエローハウスカンパニー",
    "news.banner.tag": "NEWS & UPDATES",
    "news.banner.h1": "ニュース及び市場動向",
    "news.banner.desc": "株式会社イエローハウスカンパニーの最新の事業動向、日本の不動産市場に関する洞察及び実務コラムをお届けします。",
    "news.featured_label": "注目のトピック",
    "news.featured.date": "2026年3月",
    "news.featured.tag": "実務コラム",
    "news.featured.title": "日本に根差した実務パートナー：取得から運営までを見据えた総合的な視点",
    "news.featured.desc": "私たちは取引の仲介にとどまらず、買主、オーナー、投資家及び運営者という複数の視点から、物件の本質的な価値、保有コスト及び運営リスクを総合的に評価します。",
    "news.category.title": "カテゴリー",
    "news.category.all": "すべての記事",
    "news.category.insights": "市場インサイト",
    "news.category.market": "実務コラム",
    "news.category.corp": "会社からのお知らせ",
    "news.category.media": "メディア掲載",
    "news.read_more": "記事を読む",


    // Contact Page (COMPANY INFORMATION 唯一依據)
    "contact.title": "Yellow House - お問い合わせ | 株式会社イエローハウスカンパニー",
    "contact.banner.tag": "CONTACT US",
    "contact.banner.h1": "お問い合わせ",
    "contact.banner.desc": "日本に根差した不動産実務パートナーです。高級レジデンスの購入、収益不動産への投資、賃貸管理、注文建築、宿泊施設運営など、どのようなご相談でもお気軽にお問い合わせください。",
    "contact.form.company": "会社名／組織名（任意）",
    "contact.form.name": "お名前",
    "contact.form.email": "メールアドレス",
    "contact.form.phone": "電話番号（任意）",
    "contact.form.type": "ご相談内容",
    "contact.form.type_placeholder": "事業内容を選択してください",
    "contact.form.type_res": "01 不動産売買仲介（居住用／自己居住）",
    "contact.form.type_com": "01 不動産売買仲介（商業用／収益型）",
    "contact.form.type_mgmt": "02 賃貸及び物件管理",
    "contact.form.type_resale": "03 不動産買取再販",
    "contact.form.type_dev": "04 土地開発及び注文建築",
    "contact.form.type_hospitality": "05 宿泊施設運営",
    "contact.form.type_other": "その他のご相談",
    "contact.form.message": "ご相談内容・ご要望",
    "contact.form.submit": "送信する",
    "contact.form.submitting": "送信中...",
    "contact.form.success": "お問い合わせを受け付けました。担当者より順次ご連絡いたします。",

    "contact.info.company_name_label": "会社名",
    "contact.info.company_name_val": "株式会社イエローハウスカンパニー\n（YELLOW HOUSE COMPANY）",
    "contact.info.rep_label": "代表者",
    "contact.info.rep_val": "黄経祐（代表取締役）",
    "contact.info.hq_label": "所在地",
    "contact.info.hq_val": "〒259-1132\n神奈川県伊勢原市桜台1-22-15\nネオハイツ伊勢原112",
    "contact.info.license_label": "免許番号",
    "contact.info.license_val": "神奈川県知事（1）第32070号",
    "contact.info.scope_label": "主要事業",
    "contact.info.scope_val": "不動産売買仲介、賃貸管理、買取再販、土地開発、注文建築、宿泊施設運営",
    "contact.info.contact_label": "メールアドレス",
    "contact.info.contact_val": "contact@yellowhouse.jp",
    "contact.info.hours_label": "営業時間",
    "contact.info.hours_val": "月曜〜金曜 09:00〜18:00（日本時間）\n土日・日本の祝日はオンライン相談のご予約が可能です",
    "contact.quote": "「取得、保有、管理、開発、運営から売却まで、実務経験に基づきお客様の的確な判断をサポートします。」",

    // Currency
    "currency.label": "通貨",
    "currency.updated": "為替レート更新日時",
    "currency.updated_cached": "為替レート更新日時（オフラインキャッシュ）",
    "currency.unavailable": "為替レートを取得できないため、日本円のみ表示しています",
    "currency.approx": "約",
    "currency.disclaimer": "外貨表示額は直近取得可能な為替レートに基づく参考値であり、実際の金額は為替変動により異なる場合があります。",
    "price.label": "物件価格"
  }
};

export const SUPPORTED_LANGS: Language[] = ["zh", "en", "jp"];
export const DEFAULT_LANG: Language = "zh";

// URL locale code -> standard BCP-47 code for the <html lang> attribute /
// hreflang tags. The site's Japanese *route* segment is "jp" (per product
// requirement), but the correct language code everywhere else is "ja".
export const HTML_LANG: Record<Language, string> = { zh: "zh-TW", en: "en", jp: "ja" };

function isSupportedLang(value: string | undefined): value is Language {
  return !!value && (SUPPORTED_LANGS as string[]).includes(value);
}

const LanguageContext = createContext<LanguageContextType>({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: (key: string) => key,
  localePath: (path: string) => path,
  htmlLang: HTML_LANG[DEFAULT_LANG],
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, navigate] = useLocation();
  const segments = location.split("/").filter(Boolean);
  const urlLocale = segments[0];
  const locale = isSupportedLang(urlLocale) ? urlLocale : null;

  // Bare or unrecognized-locale paths get redirected to a locale-prefixed
  // URL — using the visitor's last-chosen language when we know it, so the
  // language switch and this fallback stay consistent.
  useEffect(() => {
    if (locale) return;
    let preferred: Language = DEFAULT_LANG;
    try {
      const saved = localStorage.getItem("yh_language");
      if (isSupportedLang(saved ?? undefined)) preferred = saved as Language;
    } catch {
      // ignore
    }
    const rest = segments.join("/");
    navigate(`/${preferred}${rest ? "/" + rest : ""}`, { replace: true });
  }, [location, locale]); // eslint-disable-line react-hooks/exhaustive-deps

  const lang: Language = locale ?? DEFAULT_LANG;

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang];
  }, [lang]);

  useEffect(() => {
    if (locale) {
      try {
        localStorage.setItem("yh_language", locale);
      } catch {
        // ignore
      }
    }
  }, [locale]);

  const setLang = (newLang: Language) => {
    const rest = segments.slice(locale ? 1 : 0).join("/");
    try {
      localStorage.setItem("yh_language", newLang);
    } catch {
      // ignore
    }
    navigate(`/${newLang}${rest ? "/" + rest : ""}`);
  };

  const localePath = (path: string) => {
    const clean = path === "/" ? "" : path;
    return `/${lang}${clean}`;
  };

  const t = (key: string): string => {
    const value = translations[lang]?.[key] ?? translations.en[key] ?? translations.zh[key];
    if (value === undefined) return key;
    if (import.meta.env.DEV && lang !== "zh" && translations[lang]?.[key] === undefined) {
      // eslint-disable-next-line no-console
      console.warn(`[i18n] Missing "${lang}" translation for key: ${key}`);
    }
    return value;
  };

  // While redirecting a bare/invalid-locale URL, render nothing to avoid a
  // flash of content under the wrong (or no) locale.
  if (!locale) return null;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, localePath, htmlLang: HTML_LANG[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
