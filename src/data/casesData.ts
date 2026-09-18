export interface CaseArticle {
  id: string;
  slug: string;
  categoryZh: string;
  categoryEn: string;
  categoryJp: string;
  titleZh: string;
  titleEn: string;
  titleJp: string;
  descZh: string;
  descEn: string;
  descJp: string;
  date: string;
  image: string;
  locationZh: string;
  locationEn: string;
  locationJp: string;
  /** Reference transaction value in JPY. Omit for cases with no single transaction price (e.g. ongoing management). */
  priceJPY?: number;
  detailsZh: {
    overview: string;
    highlights: string[];
    strategy: string;
    outcome: string;
  };
  detailsEn: {
    overview: string;
    highlights: string[];
    strategy: string;
    outcome: string;
  };
  detailsJp: {
    overview: string;
    highlights: string[];
    strategy: string;
    outcome: string;
  };
}

export const CASES_DATA: CaseArticle[] = [
  {
    id: "case-1",
    slug: "minami-aoyama-luxury-residence",
    categoryZh: "住宅不動產",
    categoryEn: "Residential",
    categoryJp: "住宅用不動産",
    titleZh: "港區南青山頂級低樓層豪邸取得與長期資產配置",
    titleEn: "Acquisition & Wealth Preservation: Minami-Aoyama Low-Rise Luxury Residence",
    titleJp: "港区南青山 低層高級レジデンス取得と資産承継プラン",
    descZh: "協助海外家族辦公室篩選南青山稀有低密度住宅，完成實地勘查、隱私動線評估與價格條件談判，達成跨世代資產傳承目標。",
    descEn: "Assisted an overseas family office in securing a rare low-density residence in Minami-Aoyama with full privacy layout evaluation and deal structuring.",
    descJp: "海外のファミリーオフィス様に、南青山の希少な低層住宅を選定。現地調査、プライバシー動線の確認及び価格交渉を経て、世代を超えた資産承継の目標達成をサポートしました。",
    date: "2024.11",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
    locationZh: "東京都港區南青山",
    locationEn: "Minami-Aoyama, Minato-ku, Tokyo",
    locationJp: "東京都港区南青山",
    priceJPY: 580000000,
    detailsZh: {
      overview: "客戶為注重隱私與資產耐久性的海外家族，鎖定東京都心核心地段的高級住宅。本案標地位於南青山幽靜街區，為知名品牌建商打造之低樓層頂級住宅。",
      highlights: [
        "稀有低密度住宅區，住戶單純且保全規格嚴密",
        "室內專有面積超過 180 平方米，附雙平面車位",
        "土地持分高，具備卓越的抗跌性與抗通膨保值實力"
      ],
      strategy: "從產權結構、管理公約、修繕積立金結餘及未來周邊開發限制進行全面性盡職調查，並協助買方透過專業稅務架構完成跨境交屋與登記。",
      outcome: "成功以低於周邊平均成交單價 4.5% 的優渥條件締結契約，滿足買方家族自住度假兼長期保值的配置需求。"
    },
    detailsEn: {
      overview: "The client is a private overseas family office seeking a core Tokyo trophy asset combining elite residential privacy with multi-generational wealth preservation.",
      highlights: [
        "Rare low-density prime neighborhood with 24/7 high-grade security",
        "Generous floor plan exceeding 180 sqm with 2 underground parking bays",
        "High land share ratio delivering resilient long-term capital preservation"
      ],
      strategy: "Conducted exhaustive due diligence across ownership structures, building bylaws, reserve fund balances, and cross-border tax implications to negotiate optimal closing terms.",
      outcome: "Successfully closed at 4.5% below prevailing neighborhood benchmarks, securing a pristine residence for vacation and defensive wealth allocation."
    },
    detailsJp: {
      overview: "お客様はプライバシーと資産の耐久性を重視される海外のご家族で、東京都心の一等地に高級住宅を求めていらっしゃいました。本物件は南青山の静かな街区に位置する、著名デベロッパーによる低層高級レジデンスです。",
      highlights: [
        "希少な低層住宅街で、住民層が良質かつセキュリティ体制も万全",
        "専有面積180㎡超、地下駐車場2台分を完備",
        "高い敷地権利割合により、資産価値の下落耐性とインフレヘッジ能力に優れる"
      ],
      strategy: "権利関係、管理規約、修繕積立金の残高及び将来の周辺開発規制まで包括的なデューデリジェンスを実施し、税務面のスキームを整えたうえで国境を越えた決済・登記手続きをサポートしました。",
      outcome: "周辺相場より4.5%低い好条件で契約を締結。ご家族の別荘利用と長期的な資産保全という2つの目的を満たす結果となりました。"
    }
  },
  {
    id: "case-2",
    slug: "shibuya-commercial-income-building",
    categoryZh: "商業與收益型",
    categoryEn: "Commercial",
    categoryJp: "商業用及び収益不動産",
    titleZh: "澀谷區整棟商業店面大樓收購與收益優化專案",
    titleEn: "Acquisition & Yield Optimization: Shibuya Multi-Tenant Commercial Building",
    titleJp: "渋谷区 一棟商業ビル取得と収益改善プロジェクト",
    descZh: "針對徒步 5 分鐘內整棟商用物業進行現金流重組，透過租戶組合升級與節能設備改造，成功提升實質淨投報率。",
    descEn: "Executed comprehensive cash flow restructuring on a whole commercial building 5 minutes from Shibuya station, boosting net operating income.",
    descJp: "渋谷駅徒歩5分圏内の一棟商業物件を対象に、キャッシュフローの再構築を実施。テナント構成の見直しと省エネ設備への更新により、実質的な純利回りの向上を実現しました。",
    date: "2024.09",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85",
    locationZh: "東京都澀谷區",
    locationEn: "Shibuya-ku, Tokyo",
    locationJp: "東京都渋谷区",
    priceJPY: 1250000000,
    detailsZh: {
      overview: "本案為澀谷主要商圈周邊之整棟地上 6 層商用物業。原屋主因資產重組急需變現，本團隊以持有者視角迅速評估實際租約與硬體耐用年限。",
      highlights: [
        "距離主要車站步行僅 5 分鐘，常年維持極高客流與廣告效應",
        "具備彈性樓層分租機能，涵蓋零售餐飲與專業事務所",
        "土地臨路寬度充足，未來具備高度重建及容積利用潛力"
      ],
      strategy: "重新檢視原租賃契約條件，淘汰低效能能耗設備，並引進具品牌知名度的優質承租方以降低單一租戶違約風險。",
      outcome: "交屋後半年內淨收益率（NOI Yield）由 3.9% 提升至 4.8%，且物業整體估值成長超過 12%。"
    },
    detailsEn: {
      overview: "A 6-story commercial building located near Shibuya's core commercial district. The seller required swift liquidity for portfolio rebalancing.",
      highlights: [
        "5-minute walk to major transit hub with robust foot traffic and retail exposure",
        "Flexible floor plates supporting mix of ground-floor retail and upper-floor offices",
        "Substantial road frontage providing excellent redevelopment potential"
      ],
      strategy: "Renegotiated outdated lease terms, retrofitted energy-efficient HVAC systems, and introduced higher-tier corporate tenants to mitigate vacancy risk.",
      outcome: "Elevated the Net Operating Income (NOI) yield from 3.9% to 4.8% within six months, while increasing total asset appraisal value by over 12%."
    },
    detailsJp: {
      overview: "本案件は渋谷の中心商業エリア周辺に位置する地上6階建ての一棟商業物件です。前オーナー様が資産の再編に伴い早期の現金化を必要とされていたため、オーナー目線で実際の賃貸借契約と設備の耐用年数を迅速に評価しました。",
      highlights: [
        "主要駅から徒歩わずか5分、通年で高い人通りと広告効果を維持",
        "フロアごとの柔軟な賃貸が可能で、飲食店舗から専門オフィスまで対応",
        "接道幅に余裕があり、将来的な建て替え及び容積率活用の可能性が高い"
      ],
      strategy: "既存の賃貸借契約条件を見直し、非効率な設備を刷新するとともに、知名度の高いテナントを誘致することで単一テナント依存によるリスクを低減しました。",
      outcome: "引き渡しから半年でNOI利回りを3.9%から4.8%へ改善し、物件全体の評価額も12%以上上昇しました。"
    }
  },
  {
    id: "case-3",
    slug: "kamakura-coastal-villa-redevelopment",
    categoryZh: "土地開發與自建",
    categoryEn: "Development",
    categoryJp: "土地開発及び注文建築",
    titleZh: "神奈川鎌倉海景土地規劃與高級自建別墅專案",
    titleEn: "Land Acquisition & Bespoke Villa Development: Kamakura Coastal Project",
    titleJp: "神奈川県鎌倉市 海を望む土地計画と高級注文別荘プロジェクト",
    descZh: "克服斜坡地法規與景觀限制，整合日本一級建築師事務所完成海景自建度假別墅，兼具自用休閒與合法旅宿執照。",
    descEn: "Overcame slope terrain regulations and coastal zoning restrictions to design and construct a bespoke luxury seaside villa with lodging license.",
    descJp: "傾斜地に関する法規制及び景観規制を克服し、日本一級建築士事務所と連携して海を望む注文別荘を完成。自己利用と合法的な宿泊施設運営の両立を実現しました。",
    date: "2024.07",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85",
    locationZh: "神奈川縣鎌倉市",
    locationEn: "Kamakura, Kanagawa",
    locationJp: "神奈川県鎌倉市",
    priceJPY: 320000000,
    detailsZh: {
      overview: "客戶期盼在古都鎌倉打造遠眺相模灣的私人度假莊園。本團隊從土地買賣、法規調查、水土保持到營造招標全程統籌。",
      highlights: [
        "無遮蔽太平洋海景視野，基地隱蔽性極高",
        "全棟採用木鋼複合抗震結構與大片落地隔熱景觀玻璃",
        "取得簡易宿所營運許可，非自住期間可委託合法代管營運"
      ],
      strategy: "協調地方自治會與鎌倉市景觀審查委員會，落實耐震與防潮防風工法，並精確控管施工預算與進度。",
      outcome: "如期於 14 個月內完工取得使用執照，成為兼具自用生活享受與高收益潛力的示範標竿案。"
    },
    detailsEn: {
      overview: "The client envisioned a private seaside estate overlooking Sagami Bay. Our team managed everything from land acquisition to regulatory approvals and construction.",
      highlights: [
        "Unobstructed panoramic Pacific Ocean views in a secluded enclave",
        "Engineered seismic timber-steel hybrid architecture with thermal panoramic glass",
        "Certified with lodging operator license for flexible luxury rental during non-use"
      ],
      strategy: "Navigated Kamakura's stringent scenic preservation bylaws, secured geotechnical stabilization, and managed builder bidding to maintain strict budget discipline.",
      outcome: "Completed on schedule within 14 months, creating an iconic coastal sanctuary offering pristine lifestyle and exceptional hospitality yield."
    },
    detailsJp: {
      overview: "お客様は古都鎌倉で相模湾を一望できるプライベート別荘の実現を望んでいらっしゃいました。当社は土地取得、法規調査、地盤対策から施工発注まで全工程を一貫して統括しました。",
      highlights: [
        "遮るもののない太平洋の眺望、高いプライバシー性を備えた立地",
        "木造・鉄骨のハイブリッド耐震構造と大開口の断熱ガラスを全面採用",
        "簡易宿所の営業許可を取得し、不在時は合法的な代行運営が可能"
      ],
      strategy: "地元自治会及び鎌倉市景観審査委員会との調整を進め、耐震・防潮・防風工法を徹底するとともに、施工予算及び工程を厳格に管理しました。",
      outcome: "予定通り14か月で竣工し使用検査済証を取得。自己利用の快適さと高い収益ポテンシャルを兼ね備えた模範的な事例となりました。"
    }
  },
  {
    id: "case-4",
    slug: "shinjuku-residential-income-portfolio",
    categoryZh: "商業與收益型",
    categoryEn: "Commercial",
    categoryJp: "商業用及び収益不動産",
    titleZh: "新宿區整棟 RC 住宅公寓收購與包租代管整合",
    titleEn: "Acquisition & Full Asset Management: Shinjuku RC Residential Building",
    titleJp: "新宿区 一棟RC賃貸マンション取得と一括借上げ管理",
    descZh: "協助高資產投資人取得新宿核心生活圈整棟鋼筋混凝土（RC）出租公寓，提供多語系招租與全方位物業託管。",
    descEn: "Facilitated the purchase of a reinforced concrete residential apartment block in central Shinjuku, providing end-to-end multi-lingual leasing management.",
    descJp: "高純資産の投資家様に新宿中心エリアの鉄筋コンクリート造賃貸マンションの取得をサポート。多言語対応の入居者募集及び総合的な物件管理を提供しています。",
    date: "2024.05",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85",
    locationZh: "東京都新宿區",
    locationEn: "Shinjuku-ku, Tokyo",
    locationJp: "東京都新宿区",
    priceJPY: 890000000,
    detailsZh: {
      overview: "整棟 16 戶單身與情侶格局之鋼筋混凝土公寓，屋齡 12 年，位於租賃需求極度旺盛的新宿主要地鐵站周邊。",
      highlights: [
        "100% 滿室出租現況交屋，租金收入即刻進帳",
        "RC 耐火抗震結構，維護成本低且銀行融資評價高",
        "專業租賃團隊常駐管理，平均空室天數小於 14 天"
      ],
      strategy: "在盡調階段逐戶核對租賃歷史與保證公司履歷，交屋後導入智慧門禁與電子合約系統提升管理效能。",
      outcome: "年化實質收益率維持 4.6% 以上，為海外屋主帶來長期無憂的日圓被動現金流。"
    },
    detailsEn: {
      overview: "A 16-unit reinforced concrete (RC) residential building with strong rental demand from corporate professionals near major Shinjuku metro stations.",
      highlights: [
        "Acquired fully tenanted with instant positive cash flow from day one",
        "High-grade RC seismic construction ensuring low ongoing structural upkeep",
        "Dedicated leasing team keeping average turnover vacancy under 14 days"
      ],
      strategy: "Audited lease ledger history and tenant guarantor credentials, deploying digital access control post-settlement to streamline operations.",
      outcome: "Sustained net annual yield over 4.6%, delivering stress-free cross-border passive income for the overseas owner."
    },
    detailsJp: {
      overview: "築12年、単身・カップル向け16戸から成る鉄筋コンクリート造マンションで、新宿の主要駅周辺という賃貸需要が非常に旺盛なエリアに位置しています。",
      highlights: [
        "満室稼働のまま引き渡しが完了し、即座に賃料収入が発生",
        "RC造の耐火・耐震構造により維持コストが低く、金融機関からの評価も高い",
        "専門の賃貸管理チームが常駐し、平均空室日数は14日未満"
      ],
      strategy: "デューデリジェンス段階で全戸の賃貸履歴及び保証会社の実績を確認し、引き渡し後にはスマート入退室システム及び電子契約システムを導入して管理効率を高めました。",
      outcome: "年間実質利回りは4.6%以上を維持し、海外オーナー様に安定した円建てのパッシブインカムをもたらしています。"
    }
  },
  {
    id: "case-5",
    slug: "roppongi-penthouse-renovation-resale",
    categoryZh: "收購再販與翻新",
    categoryEn: "Renovation & Resale",
    categoryJp: "買取再販及びリノベーション",
    titleZh: "六本木高樓層景觀宅收購、頂級改裝與再販專案",
    titleEn: "Value-Add: Roppongi High-Rise Penthouse Renovation & Resale",
    titleJp: "六本木 高層眺望レジデンスの取得・高級リノベーション・再販プロジェクト",
    descZh: "收購屋況陳舊之都心精華地段大坪數住宅，結合日本當代侘寂美學重塑室內空間，三個月內以創紀錄溢價成交出售。",
    descEn: "Acquired a legacy high-floor unit in prime Roppongi, executing high-spec Japanese modern renovation and achieving a record exit valuation.",
    descJp: "都心一等地に立地しながら内装が老朽化していた大型住戸を取得し、日本の現代的な侘寂の美意識を取り入れて空間を再構築。わずか3か月で記録的なプレミアム価格での売却を実現しました。",
    date: "2024.03",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85",
    locationZh: "東京都港區六本木",
    locationEn: "Roppongi, Minato-ku, Tokyo",
    locationJp: "東京都港区六本木",
    priceJPY: 310000000,
    detailsZh: {
      overview: "鎖定港區六本木具有地標景觀但室內裝潢老舊的中古高級物件，評估拆除重組之附加價值潛力後果斷收購。",
      highlights: [
        "直面東京鐵塔景觀的無價開闊視野",
        "引進頂級天然石材、隱藏式空調與進口名牌廚具衛浴",
        "重新規劃起居動線，增設獨立酒窖與衣帽間"
      ],
      strategy: "統籌工班與室內設計團隊於 60 天內完成精密改裝，並透過封閉式高資產買家網絡進行專案銷售。",
      outcome: "改裝完成後第 22 天即由海外買家以全現金全額買受，專案總投報率（ROI）達 21.8%。"
    },
    detailsEn: {
      overview: "Targeted an older spacious luxury condominium unit in Roppongi boasting panoramic Tokyo Tower views that suffered from outdated interior fittings.",
      highlights: [
        "Unrivaled direct view of Tokyo Tower and skyline",
        "Imported Italian marble, concealed climate systems, and bespoke German kitchen fixtures",
        "Optimized layout adding a private wine cellar and expanded walk-in dressing suite"
      ],
      strategy: "Directed architectural renovation within a tight 60-day window, followed by targeted private placement marketing across international family networks.",
      outcome: "Secured an all-cash purchase within 22 days of completion, generating a net project ROI of 21.8%."
    },
    detailsJp: {
      overview: "港区六本木において、ランドマーク的な眺望を持ちながら内装が古い中古の高級住戸に着目し、解体・再構成による付加価値のポテンシャルを見極めたうえで即断で取得しました。",
      highlights: [
        "東京タワーを正面に望む、他に代えがたい開放的な眺望",
        "高級天然石材、隠蔽型空調及び海外ブランドのキッチン・バス設備を導入",
        "生活動線を全面的に再設計し、独立したワインセラー及びウォークインクローゼットを新設"
      ],
      strategy: "施工チーム及びインテリアデザインチームを統括し、60日間で精緻なリノベーションを完遂。クローズドな富裕層バイヤーネットワークを通じて販売活動を実施しました。",
      outcome: "改装完了からわずか22日で海外バイヤーが全額現金で購入。プロジェクト全体のROIは21.8%に達しました。"
    }
  },
  {
    id: "case-6",
    slug: "hakone-hotspring-ryokan-revitalization",
    categoryZh: "住宿設施營運",
    categoryEn: "Hospitality",
    categoryJp: "宿泊施設運営",
    titleZh: "箱根天然溫泉旅宿取得、品牌重塑與合法營運",
    titleEn: "Hospitality Transformation: Hakone Natural Onsen Villa Operations",
    titleJp: "箱根 天然温泉旅館の取得・ブランド再構築と適法運営",
    descZh: "取得箱根知名溫泉區閒置別墅，完成溫泉引湯執照更新與奢華包棟改造，建構高平均房價（ADR）之精緻旅宿資產。",
    descEn: "Acquired a private onsen property in Hakone, renewed hot spring water rights, and converted it into an exclusive boutique villa.",
    descJp: "箱根の有名温泉エリアで空き家となっていた別荘を取得し、温泉引湯権の許可更新と一棟貸し高級リノベーションを実施。高い平均客室単価（ADR）を誇る上質な宿泊資産へと生まれ変わらせました。",
    date: "2024.01",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=85",
    locationZh: "神奈川縣足柄下郡箱根町",
    locationEn: "Hakone, Kanagawa",
    locationJp: "神奈川県足柄下郡箱根町",
    priceJPY: 180000000,
    detailsZh: {
      overview: "箱根為日本最具代表性的國際觀光名所。本案為私人持有的傳統木造溫泉宅邸，經本公司整體評估後轉型為包棟奢華度假宿所。",
      highlights: [
        "源泉直通之室內檜木風呂與露天岩石風呂",
        "合法取得旅館業法簡易宿所營業許可",
        "配備多國語言智慧管家系統與遠端門禁管理"
      ],
      strategy: "更新溫泉管線與防火安全設備，建立與各大國際訂房平台之直連渠道，提供海外房東完全被動的管理分潤體系。",
      outcome: "自開幕以來平均住房率達 78%，旺季 ADR 超過 12 萬日圓，年化毛租金收益率逾 9.5%。"
    },
    detailsEn: {
      overview: "Located in Hakone's premier hot spring district, this traditional estate was acquired and repurposed into an ultra-luxury private rental sanctuary.",
      highlights: [
        "Direct natural thermal spring source with indoor cypress and outdoor stone baths",
        "Fully licensed under Japanese Hotel & Ryokan Management Laws",
        "Smart multilingual concierge and remote check-in infrastructure"
      ],
      strategy: "Refurbished thermal plumbing, elevated fire-safety standards, and linked global booking engines with transparent automated owner reporting.",
      outcome: "Achieved 78% average annual occupancy with peak ADR exceeding JPY 120,000, generating a gross hospitality yield of 9.5%."
    },
    detailsJp: {
      overview: "箱根は日本を代表する国際的な観光地です。本件は個人が所有していた伝統的な木造温泉邸宅を取得し、総合的な評価のうえ一棟貸しの高級リゾート宿泊施設へと転換しました。",
      highlights: [
        "源泉かけ流しの檜風呂及び露天岩風呂を完備",
        "旅館業法に基づく簡易宿所営業許可を適法に取得",
        "多言語対応のスマートコンシェルジュシステム及び遠隔入退室管理を導入"
      ],
      strategy: "温泉配管及び防火安全設備を刷新し、主要な国際予約プラットフォームとの直接連携を構築。海外オーナー様に完全にパッシブな管理・収益分配の仕組みを提供しました。",
      outcome: "開業以来の平均稼働率は78%、繁忙期のADRは12万円を超え、年間の粗収益利回りは9.5%以上に達しています。"
    }
  },
  {
    id: "case-7",
    slug: "ginza-commercial-retail-strata",
    categoryZh: "商業與收益型",
    categoryEn: "Commercial",
    categoryJp: "商業用及び収益不動産",
    titleZh: "中央區銀座一丁目核心店面分層產權配置",
    titleEn: "Prime Retail Investment: Ginza 1-Chome Commercial Strata Acquisition",
    titleJp: "中央区銀座一丁目 中心部店舗区分所有権の取得",
    descZh: "鎖定銀座精品商圈稀有釋出之一樓臨街店面，協助外國法人完成跨國融資與長期租約穩定收益架構。",
    descEn: "Secured a rare ground-floor retail unit in prestigious Ginza, structuring favorable cross-border debt financing and guaranteed long leases.",
    descJp: "銀座の高級商業エリアで希少に売り出された1階路面店舗に着目し、海外法人様の国際的な資金調達と長期賃貸借契約による安定収益構造の構築をサポートしました。",
    date: "2023.11",
    image: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1600&q=85",
    locationZh: "東京都中央區銀座",
    locationEn: "Ginza, Chuo-ku, Tokyo",
    locationJp: "東京都中央区銀座",
    priceJPY: 720000000,
    detailsZh: {
      overview: "銀座地段具備極高全球資產識別度。本標的位於銀座一丁目黃金街角，租客為知名高級珠寶鐘錶品牌。",
      highlights: [
        "銀座核心區極稀缺之一樓店面獨立產權",
        "國際知名精品租客簽署 10 年定期借家契約",
        "抗通膨保值指標資產，極易在二級市場轉手變現"
      ],
      strategy: "協助海外法人架構合規日本分支或 GK-TK 結構，並向日本在地銀行爭取低利長期融資方案。",
      outcome: "順利完成交割，享有穩健現金流之餘，土地公告地價每年維持穩健增長。"
    },
    detailsEn: {
      overview: "Ginza represents the pinnacle of Japanese commercial prestige. This acquisition secured a prime ground-floor retail unit leased to an international luxury watchmaker.",
      highlights: [
        "Extremely scarce ground-floor frontage property in core Ginza",
        "Anchored by creditworthy luxury brand on a 10-year fixed-term lease",
        "Unrivaled asset liquidity and defensive resilience against market volatility"
      ],
      strategy: "Structured compliant corporate vehicle and arranged competitive local bank financing with attractive fixed rates.",
      outcome: "Closed successfully, delivering predictable yields alongside steady year-on-year land valuation increases."
    },
    detailsJp: {
      overview: "銀座は世界的に高い資産としての認知度を誇るエリアです。本物件は銀座一丁目の一等地の角地に位置し、有名な高級時計・宝飾ブランドがテナントとして入居しています。",
      highlights: [
        "銀座中心部において極めて希少な、独立区分所有の1階路面店舗",
        "世界的に著名な高級ブランドが10年の定期借家契約を締結",
        "インフレヘッジ性の高い指標資産であり、セカンダリーマーケットでの流動性も極めて高い"
      ],
      strategy: "海外法人様の日本国内支店またはGK-TKスキームの適法な構築をサポートし、日本国内の銀行から低金利の長期融資条件を引き出しました。",
      outcome: "無事に決済を完了し、安定したキャッシュフローを確保するとともに、公示地価も毎年着実な上昇を続けています。"
    }
  },
  {
    id: "case-8",
    slug: "yokohama-bayview-tower-condominium",
    categoryZh: "住宅不動產",
    categoryEn: "Residential",
    categoryJp: "住宅用不動産",
    titleZh: "橫濱港未來海景超高層景觀塔樓住宅配置",
    titleEn: "Coastal Skyline Living: Minato Mirai Yokohama Luxury Tower Condominium",
    titleJp: "横浜みなとみらい 海を望む超高層タワーレジデンスの取得",
    descZh: "為計畫部分時間移居日本的海外客戶，精選橫濱港未來地標超高層豪宅，完成全套傢俱配置與入境居住準備。",
    descEn: "Curated a landmark high-floor tower residence in Minato Mirai Yokohama for an international client planning partial relocation to Japan.",
    descJp: "日本への部分的な移住を計画されている海外のお客様に、横浜みなとみらいのランドマーク的な超高層レジデンスをご提案。家具一式の設置から入居準備までを整えました。",
    date: "2023.09",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85",
    locationZh: "神奈川縣橫濱市西區",
    locationEn: "Minato Mirai, Nishi-ku, Yokohama",
    locationJp: "神奈川県横浜市西区",
    priceJPY: 215000000,
    detailsZh: {
      overview: "客戶重視國際化生活氛圍與開闊海景。本案位於橫濱港未來指標性 50 層超高層制震塔樓，配置 24 小時禮賓服務與專屬健身會所。",
      highlights: [
        "高樓層東南向，飽覽橫濱灣、彩虹大橋與富士山景致",
        "直通地鐵站之全天候地下連通步道",
        "五星級公共設施（景觀 Lounge、宴會廳、客房套房）"
      ],
      strategy: "提供從選屋、產權調查、換匯時點諮詢，到完工驗屋、高端日本傢俱訂製採購之一站式服務。",
      outcome: "客戶抵達日本即可無縫入住，並在非居住期間提供嚴密的空室巡查與定期通風保養。"
    },
    detailsEn: {
      overview: "The buyer desired an international lifestyle with marine views. Selected an elite 50-story tower condominium in Minato Mirai with full concierge services.",
      highlights: [
        "High-floor southeast orientation capturing views of Yokohama Bay and Mount Fuji",
        "Direct weather-protected underground access to the subway station",
        "Comprehensive amenities including sky lounge, guest suites, and fitness center"
      ],
      strategy: "Delivered turnkey support spanning unit selection, technical inspection, foreign exchange planning, and luxury furnishing procurement.",
      outcome: "Enabled flawless move-in ready handover, backed by regular maintenance and inspection during owner absence."
    },
    detailsJp: {
      overview: "お客様は国際色豊かな暮らしと開放的な海の眺望を重視されていました。本物件は横浜みなとみらいを象徴する制震構造50階建てタワーに位置し、24時間対応のコンシェルジュサービス及び専用フィットネスラウンジを完備しています。",
      highlights: [
        "高層階・南東向きで、横浜港、ベイブリッジ及び富士山の眺望を一望",
        "駅直結の全天候型地下連絡通路を完備",
        "スカイラウンジ、宴会場、ゲストスイートなど5つ星水準の共用施設"
      ],
      strategy: "住戸選定、権利関係の調査、為替タイミングのご相談から、竣工検査及び高級家具のオーダーメイド調達まで、ワンストップでサポートしました。",
      outcome: "お客様は来日と同時にシームレスに入居可能となり、不在時にも厳格な巡回点検と定期的な換気メンテナンスを提供しています。"
    }
  },
  {
    id: "case-9",
    slug: "meguro-residential-land-development",
    categoryZh: "土地開發與自建",
    categoryEn: "Development",
    categoryJp: "土地開発及び注文建築",
    titleZh: "目黑區閑靜住宅地分割開發與雙拼別墅規劃",
    titleEn: "Subdivision & Development: Prime Residential Enclave in Meguro",
    titleJp: "目黒区 閑静な住宅地の分割開発と2棟の邸宅計画",
    descZh: "整合目黑區大坪數老舊木造宅地，重新進行地目分割與建築容積最大化設計，建造兩棟當代節能獨立洋房。",
    descEn: "Acquired legacy land in Meguro, completing strategic parcel subdivision and architectural design for two contemporary high-efficiency residences.",
    descJp: "目黒区の大型老朽木造住宅地を統合し、地目分割及び容積率を最大限に活用した設計を実施。現代的な省エネ性能を備えた独立2棟の邸宅を建築しました。",
    date: "2023.07",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
    locationZh: "東京都目黑區",
    locationEn: "Meguro-ku, Tokyo",
    locationJp: "東京都目黒区",
    priceJPY: 620000000,
    detailsZh: {
      overview: "原基地為繼承後閒置之大面積老舊建物。本團隊評估周邊高級住宅需求強烈，決定進行拆除、分割與全新自建設計。",
      highlights: [
        "目黑優質學區與綠蔭街廓，自住家庭需求極高",
        "符合日本最高等級『耐震等級 3』與『斷熱等極 6』節能規格",
        "每戶配置獨立庭院、屋頂露台與雙車位車庫"
      ],
      strategy: "精算土地取得成本與營造預算，親自監督結構體施工與防水細節，落實持有者視角的品質承諾。",
      outcome: "兩棟別墅於上棟階段即分別由日商高階主管及外籍專業人士以預售方式全數簽約售出。"
    },
    detailsEn: {
      overview: "An estate inheritance property in Meguro. Our team identified strong residential demand and undertook demolition, land subdivision, and luxury home construction.",
      highlights: [
        "Prestige school district and tree-lined surroundings favored by executive families",
        "Engineered to highest Japanese Seismic Grade 3 and Thermal Efficiency Grade 6",
        "Each home features private landscaped garden, rooftop terrace, and double garage"
      ],
      strategy: "Controlled total acquisition and construction costs while personally supervising structural integrity and building envelope durability.",
      outcome: "Both custom homes were contracted off-plan prior to roof completion to multinational executives."
    },
    detailsJp: {
      overview: "本物件は相続により空き家となっていた大型の老朽建物でした。当社は周辺エリアで高級住宅への需要が強いと判断し、解体、土地分割及び新築設計を決断しました。",
      highlights: [
        "目黒の優良学区と緑豊かな街並みにより、自己居住需要が非常に高い",
        "日本国内最高水準の『耐震等級3』及び『断熱等性能等級6』に対応",
        "各邸宅に専用庭、屋上テラス及び2台分の駐車スペースを設置"
      ],
      strategy: "土地取得コスト及び建築予算を精緻に管理し、構造躯体の施工及び防水処理を自ら監督することで、オーナー目線の品質へのこだわりを徹底しました。",
      outcome: "上棟の段階で、それぞれ日系企業の役員及び外国籍の専門職の方に完売となりました。"
    }
  },
  {
    id: "case-10",
    slug: "shinjuku-resale-value-renovation",
    categoryZh: "收購再販與翻新",
    categoryEn: "Renovation & Resale",
    categoryJp: "買取再販及びリノベーション",
    titleZh: "西新宿中古套房批次收購、系統化翻新與高投報釋出",
    titleEn: "Portfolio Renovation: Batch Acquisition & Resale in Nishi-Shinjuku",
    titleJp: "西新宿 中古ワンルーム一括取得・システム化リノベーションと高収益売却",
    descZh: "在西新宿商業商圈一次性收購 4 戶老舊單身公寓，採用模組化精密改裝降低成本，創造雙位數資產增值回報。",
    descEn: "Acquired a batch of 4 older studio apartments in Nishi-Shinjuku, applying modular high-grade renovation to deliver double-digit capital appreciation.",
    descJp: "西新宿の商業エリアで老朽化した単身向けマンション4戸を一括取得し、モジュール化された精密リノベーションでコストを抑制。二桁台の資産増価リターンを実現しました。",
    date: "2023.05",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=85",
    locationZh: "東京都新宿區西新宿",
    locationEn: "Nishi-Shinjuku, Shinjuku-ku, Tokyo",
    locationJp: "東京都新宿区西新宿",
    priceJPY: 168000000,
    detailsZh: {
      overview: "針對都心租屋族群對現代化廚衛與乾濕分離的強烈需求，將 1990 年代老舊三合一衛浴公寓全面升級重組。",
      highlights: [
        "緊鄰東京都廳與新宿中央公園，商務租屋剛性需求強勁",
        "改裝為乾濕分離獨立衛浴、全室超耐磨木地板與隱藏收納",
        "配備高速光纖網路與智慧門鎖，吸引外商及 IT 工程師承租"
      ],
      strategy: "透過批次採購建材大幅壓低每戶改裝成本，翻新完成後立即以高於原租金 25% 完成招租並分批轉售給長期收租買家。",
      outcome: "4 戶總計於 8 個月內全數結案，平均單戶年化資本回報率超過 18.5%。"
    },
    detailsEn: {
      overview: "Upgraded 1990s units with outdated unit baths in central Tokyo into sleek, modern studios designed for tech and corporate professionals.",
      highlights: [
        "Steps from Tokyo Metropolitan Government Building and Shinjuku Central Park",
        "Converted to separated luxury shower rooms, oak flooring, and clever built-in storage",
        "Integrated gigabit fiber and digital keypad access"
      ],
      strategy: "Leveraged bulk material procurement to reduce cost, secured tenants at 25% rental premiums, and packaged them for individual yield-focused buyers.",
      outcome: "Completed all 4 asset exits within 8 months, realizing an average annualized capital gain exceeding 18.5%."
    },
    detailsJp: {
      overview: "都心の賃貸ニーズに応えるべく、最新設備の水回り及び乾湿分離を強く求める入居者層に向け、1990年代築の3点ユニットバス住戸を全面的にアップグレードしました。",
      highlights: [
        "東京都庁及び新宿中央公園に近接し、ビジネス層からの根強い賃貸需要",
        "乾湿分離の独立バスルーム、全室高耐久フローリング及び隠蔽収納へ改装",
        "高速光ファイバー及びスマートロックを導入し、外資系企業やITエンジニアの入居を誘致"
      ],
      strategy: "建材の一括調達により1戸あたりの改装コストを大幅に圧縮し、改装完了後は既存賃料より25%高い水準で入居を確定させたうえで、長期保有志向のバイヤーへ順次売却しました。",
      outcome: "4戸すべてを8か月以内に売却完了し、1戸あたりの平均年間資本収益率は18.5%を超えました。"
    }
  },
  {
    id: "case-11",
    slug: "chiba-suburban-logistic-land",
    categoryZh: "土地開發與自建",
    categoryEn: "Development",
    categoryJp: "土地開発及び注文建築",
    titleZh: "千葉高速公路交流道周邊物流倉儲用地規劃",
    titleEn: "Industrial Development: Suburban Logistics Land Planning in Chiba",
    titleJp: "千葉県 高速道路インターチェンジ周辺の物流倉庫用地計画",
    descZh: "協助國際物流投資基金取得交流道旁萬坪工業用地，統籌農地變更、道路鋪設與地質改良等前端繁複法規流程。",
    descEn: "Guided an international logistics fund through land acquisition, zoning conversions, and infrastructure feasibility near major highway interchanges.",
    descJp: "国際物流投資ファンド様のインターチェンジ近接の大型工業用地取得をサポート。農地転用、道路整備及び地盤改良など、前段階の複雑な法規手続きを一貫して統括しました。",
    date: "2023.03",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=85",
    locationZh: "千葉縣",
    locationEn: "Chiba Prefecture",
    locationJp: "千葉県",
    priceJPY: 450000000,
    detailsZh: {
      overview: "因應電子商務蓬勃發展，大東京首都圈周邊具備便利高速公路節點的現代化倉儲物流用地極度搶手。",
      highlights: [
        "距東關東自動車道交流道僅 3 分鐘車程",
        "地勢平坦且周邊無密集住宅區，具備 24 小時貨車進出條件",
        "土地總面積超過 15,000 平方米"
      ],
      strategy: "協調地方政府落實都市計畫法規調查、土地境界確認與環境影響評估，排除各項隱藏開發障礙。",
      outcome: "成功協助投資方完成產權過戶並取得物流中心建築許可，創造卓越的土地升值潛力。"
    },
    detailsEn: {
      overview: "Driven by booming e-commerce, prime logistics plots adjacent to major Greater Tokyo arterial expressways are in intense demand.",
      highlights: [
        "3 minutes from Higashi-Kanto Expressway interchange",
        "Flat topography outside residential noise zones, permitting 24/7 heavy transport",
        "Total site parcel area exceeding 15,000 sqm"
      ],
      strategy: "Handled urban zoning verifications, boundary confirmations, and environmental compliance with municipal authorities.",
      outcome: "Facilitated smooth title transfer and development permits for modern warehouse construction, generating significant land value upside."
    },
    detailsJp: {
      overview: "eコマースの急成長を背景に、首都圏近郊で高速道路のアクセスに優れた現代的な倉庫物流用地は極めて高い需要があります。",
      highlights: [
        "東関東自動車道のインターチェンジよりわずか3分",
        "平坦な地形かつ住宅密集地から離れており、24時間のトラック出入りが可能",
        "敷地総面積は15,000平方メートルを超える"
      ],
      strategy: "地方自治体と連携し、都市計画法規の調査、土地境界の確認及び環境影響評価を進め、開発を阻む潜在的な障害を一つずつ解消しました。",
      outcome: "投資家様の権利移転及び物流センター建築許可の取得を円滑にサポートし、優れた土地の値上がりポテンシャルを実現しました。"
    }
  },
  {
    id: "case-12",
    slug: "isehara-residential-leasing-management",
    categoryZh: "商業與收益型",
    categoryEn: "Commercial",
    categoryJp: "商業用及び収益不動産",
    titleZh: "神奈川伊勢原整棟收益住宅長期代管與資產維護",
    titleEn: "Asset Management: Long-Term Leasing & Structural Care in Isehara",
    titleJp: "神奈川県伊勢原 一棟収益賃貸住宅の長期管理と資産保全",
    descZh: "在公司根據地神奈川伊勢原管理多棟收益型公寓，落實預防性修繕計畫與零糾紛租務管理，維持 98% 以上常態滿室率。",
    descEn: "Managing multiple multi-family residential assets in Kanagawa Isehara, maintaining 98%+ occupancy with preventive maintenance and zero disputes.",
    descJp: "当社の本拠地である神奈川県伊勢原にて複数棟の収益型マンションを管理し、予防保全計画とトラブルゼロの賃貸運営を徹底。98%を超える高い稼働率を維持しています。",
    date: "2023.01",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85",
    locationZh: "神奈川縣伊勢原市",
    locationEn: "Isehara-shi, Kanagawa",
    locationJp: "神奈川県伊勢原市",
    detailsZh: {
      overview: "在公司總部所在地神奈川伊勢原深耕多年，本團隊親自管理多棟公寓，以房東第一線實戰心法為業主守護資產。",
      highlights: [
        "在地 15 年深厚人脈與優質房仲租賃聯網",
        "嚴謹的租戶身分審查與保證人制度，零租金拖欠率",
        "定期外牆塗裝與給排水維護，維持建築高淨值"
      ],
      strategy: "制定 10 年長期修繕計畫，按部就班累積修繕儲備金，避免突發性大額支出衝擊業主現金流。",
      outcome: "十年來平均稼動率始終維持在 98% 以上，為業主創造歷久不衰的穩固被動回報。"
    },
    detailsEn: {
      overview: "Rooted in our headquarters area of Kanagawa Isehara for over 15 years, our hands-on owner mentality safeguards client property value.",
      highlights: [
        "15 years of local brokerage partnerships and deep community network",
        "Rigorous tenant vetting and mandatory rent guarantee policies ensuring zero delinquency",
        "Proactive exterior maintenance and MEP upkeep protecting asset lifespan"
      ],
      strategy: "Implemented 10-year preventive maintenance programs, avoiding unexpected capital calls and smoothing landlord yields.",
      outcome: "Sustained a consistent 98%+ occupancy rate across a decade of trusted stewardship."
    },
    detailsJp: {
      overview: "当社の本社所在地である神奈川県伊勢原で長年にわたり地域に根差し、複数棟のマンションを自ら管理。現場のオーナー目線に基づく実践的なノウハウでオーナー様の資産をお守りしています。",
      highlights: [
        "15年にわたる地域での深い人脈と質の高い不動産ネットワーク",
        "厳格な入居審査及び保証人制度により、家賃滞納率はゼロ",
        "定期的な外壁塗装及び給排水設備のメンテナンスにより建物の資産価値を維持"
      ],
      strategy: "10年単位の長期修繕計画を策定し、計画的に修繕積立金を積み立てることで、突発的な高額支出がオーナー様のキャッシュフローを圧迫することを防いでいます。",
      outcome: "この10年間、平均稼働率は常に98%を超え、オーナー様に長期にわたり安定したパッシブリターンをもたらしています。"
    }
  }
];
