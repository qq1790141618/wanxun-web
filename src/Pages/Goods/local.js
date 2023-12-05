export default {
    loading: {
        zh: '内容加载中',
        en: 'Contents Loading',
        kor: '요청 중',
        jp: '読み込み中',
        th: 'การโหลดข้อมูล'
    },
    httpFail: {
        zh: '请求失败::服务器请求错误',
        en: 'Request Failed::Server Request Error',
        kor: '요청 실패: 서버 요청 오류',
        jp: 'HTTP 失敗: サーバー 要求 エラー',
        th: 'การโหลดข้อมูลไม่สำเร็จ: การสั่งซื้อออก'
    },
    condition: {
        zh: '查询条件',
        en: 'Query Criteria',
        kor: '질의 조건',
        jp: 'クエリー条件',
        th: 'เงื่อนไขการสอบถาม'
    },
    stylenumber: {
        zh: '款号',
        en: 'Style Number',
        kor: '스타일 번호',
        jp: 'スタイルナンバー',
        th: 'รหัสสินค้า'
    },
    productnumber: {
        zh: '货号',
        en: 'Product Number',
        kor: '상품 번호',
        jp: '商品番号',
        th: 'สินค้า รหัส'
    },
    'miaostreet-id': {
        zh: '喵街ID',
        en: 'Miaostreet ID',
        kor: 'Miaostreet ID',
        jp: 'Miaostreet ID',
        th: 'Miaostreet ID'
    },
    unUpload: {
        zh: '未上传',
        en: 'Not Uploaded ',
        kor: '업로드되지 않음 ',
        jp: 'アップロードされていません',
        th: 'ไม่ได้อัพโหลด'
    },
    tip1: {
        zh: '使用换行或者英文逗号","分开',
        en: 'Separate with line breaks or English commas ","',
        kor: '줄 바꿈 또는 영어 쉼표 사용","분리',
        jp: '改行または英語のコンマ","区切り"を使用する',
        th: 'ใช้การตัดบรรทัดหรือภาษาอังกฤษเครื่องหมายจุลภาค "," แยก'
    },
    supplier: {
        zh: '供应商',
        en: 'Supplier',
        kor: '수급자',
        jp: '提供者',
        th: 'ผู้จำหนับ'
    },
    mainImage: {
        zh: '主图',
        en: 'Main Image',
        kor: '대표이미지',
        jp: 'メイン画像',
        th: 'หน้าอัพ'
    },
    price: {
        zh: '日销价',
        en: 'Daily Sales Price',
        kor: '일일매출가격',
        jp: '日销り価格',
        th: 'ราคาขายวัน'
    },
    cost: {
        zh: '成本价',
        en: 'Cost',
        kor: '원래가격',
        jp: '本体価格',
        th: 'ราคาสินค้า'
    },
    firstListingTime: {
        zh: '首次上架时间',
        en: 'First Listing Time',
        kor: '처음 상장 시간',
        jp: '初回販売時間',
        th: 'การซื้อแรก'
    },
    category: {
        zh: '类目',
        en: 'Category',
        kor: '품목',
        jp: 'クラス',
        th: 'หมวดหมู่'
    },
    choose: {
        zh: '选择',
        en: 'Choose ',
        kor: '선택 ',
        jp: 'せんたく',
        th: 'เลือก'
    },
    confirm: {
        zh: '确认',
        en: 'Confirm',
        kor: '확인',
        jp: '確認',
        th: 'ยืนยัน'
    },
    reset: {
        zh: '重置',
        en: 'Reset',
        kor: '초기화',
        jp: 'リセット',
        th: 'รีเซ็ต'
    },
    salesCount: {
        zh: '销售数量',
        en: 'Sales Count',
        kor: '판매 수량',
        jp: '販売 数',
        th: 'ข้อมูลการขาย'
    },
    image: {
       zh: '图片',
       en: 'Image',
       kor: '사진',
       jp: '画像',
       th: 'รูปภาพ'
   },
   goodName: {
       zh: '商品名称',
       en: 'Good Name',
       kor: '상품 이름',
       jp: '商品名',
       th: 'สินค้า ชื่อ'
   },
   operate: {
       zh: '操作',
       en: 'Operate',
       kor: '작업',
       jp: '操作',
       th: 'การทำ'
   },
   edit: {
       zh: '编辑',
       en: 'Edit',
       kor: '수정',
       jp: '編集',
       th: 'แก้ไข'
    },
    copy: {
        zh: '复制',
        en: 'Copy ',
        kor: '복사',
        jp: 'コピー',
        th: 'ซักซื้อ'
    },
    viewGoods: {
        zh: '查看商品', 
        en: 'View Goods',
        kor: '상품 보기',
        jp: '商品を見る',
        th: 'ดูสินค้า'
    },
    removeGoods: {
        zh: '移除商品',
        en: 'Remove Goods',
        kor: '상품 제거',
        jp: '商品を削除',
        th: 'ลบสินค้า'
    },
    exportQueryGoods: {
        zh: '导出查询商品',
        en: 'Export Query Goods',
        kor: '검색 상품 내보내기',
        jp: '検索商品をエクスポート',
        th: 'ส่งค้นหาสินค้า'
    },
    exporting: {
        zh: '导出中...',
        en: 'Exporting...',
        kor: '내보내는 중...',
        jp: 'エクスポート中...',
        th: 'กำลังส่ง...'
    },
    exportSuccess: {
        zh: '导出成功',
        en: 'Export Success',
        kor: '내보내기 성공',
        jp: 'エクスポート 成功',
        th: 'ส่งสำเร็จ'
    },
    selected: (number) => {
        if(number == 0){
            return {
                zh: '未选择任何数据',
                en: 'No data selected',
                kor: '선택된 데이터가 없습니다',
                jp: '選択されたデータはありません',
                th: 'ไม่มีข้อมูล'
            }
        }
        return {
            zh: `已选择 ${number} 项数据`,
            en: `Selected ${number} items`,
            kor: `${number}개 선택됨`,
            jp: `${number}件 選択されました`,
            th: `เลือก ${number} รายการ`
        }
    },
    batch: {
        zh: '批量',
        en: 'Batch ',
        kor: '일괄 ',
        jp: '一括処理',
        th: 'หนึ่งล็อต'
    },
    miaostreetListingStatus: {
        zh: '喵街上架状态',
        en: 'Miaostreet Listing Status',
        kor: '마이오스트리트 상태',
        jp: 'マイオストリート ステータス',
        th: 'สถานะของมายอสตรีเทรด'
    },
    tmallListingStatus: {
        zh: '天猫上架状态',
        en: 'TMall Listing Status',
        kor: 'TMall 상태',
        jp: 'TMall ステータス',
        th: 'สถานะของเมทอล'
    },
    listing: {
        zh: '上架',
        en: 'Listing',
        kor: '상태',
        jp: 'ステータス',
        th: 'เข้าร้าน'
    },
    unlist: {
        zh: '下架',
        en: 'Unlist',
        kor: '미상',
        jp: 'アンダフレーム',
        th: 'ออกจากร้าน'
    },
    cancel: {
        zh: '取消',
        en: 'Cancel',
        kor: '취소',
        jp: 'キャンセル',
        th: 'ยกเลิก'
    },
    batchEdited: (number) => {
        if(number == 0){
            return {
                zh: '未修改任何数据',
                en: 'No data edited',
                kor: '수정된 데이터가 없습니다',
                jp: '編集されたデータはありません',
                th: 'ไม่มีข้อมูลที่แก้ไข'
            }
        }
        return {
            zh: `已修改 ${number} 个SKU`,
            en: `Edited ${number} SKU`,
            kor: `${number}개의 SKU 수정됨`,
            jp: `${number}個のSKU 編集されました`,
            th: `แก้ไขข้อมูล ${number} รายการ SKU`
        }
    },
    viewMiaostreetLink: {
        zh: '查看喵街链接',
        en: 'View Miaostreet link',
        kor: 'Miaostreet 링크 보기',
        jp: 'Miaostreet リンクを表示',
        th: 'ดูลิงค์ Miaostreet'
    },
    mapping: {
        zh: '映射',
        en: ' Mapping',
        kor: ' 매핑',
        jp: 'マッピング',
        th: 'แปลง'
    },
    informationImport: {
        zh: '导入信息',
        en: 'Import information',
        kor: ' 정보 가져오기',
        jp: '情報をインポート',
        th: 'นำเข้าข้อมูล'
    },
    highlight: {
        zh: '高亮',
        en: ' Highlight',
        kor: ' 강조',
        jp: 'ハイライト',
        th: 'แสดงผล'
    },
    tip2: {
        zh: '这将使所有未设置供应商的款式设置为指定的供应商, 确定继续吗？',
        en: 'This will set all unset styles to the specified supplier, are you sure?',
        kor: '이 작업은 모든 스타일을 지정된 공급업체로 설정하는 것입니다. 확인하시겠습니까?',
        jp: 'これにより、すべての未設定のスタイルが指定された仕入先に設定さ れます。 よろしいですか？',
        th: 'ทำนี้จะตั้งเป็นทั้งหมด สินค้งที่ไม่ได้ตั้งหรือเปลี่ยนแปลงสถานะผู้จำหน่าย ต้องการดำเนินการให้ ใช่หรือไม่?'
    },
    supplierMapToEmpty: {
        zh: '映射目标的供应商不能为空',
        en: 'Mapping target supplier can not be empty',
        kor: '매핑 대상 공급업체는 공백이 될 수 없습니다',
        jp: 'マッピング ターゲット 仕入先は空欄にできません',
        th: 'แปลง ที่เป็น ที่จะเปลี่ยนแปลง ไม่สามารถเป็น ว่างได้'
    },
    tip: {
        zh: '提示',
        en: 'Tip',
        kor: '팁',
        jp: 'ヒント',
        th: 'คำแนะนำ'
    },
    original: {
        zh: '原始',
        en: 'Original ',
        kor: '원본 ',
        jp: 'オリジナル',
        th: 'เดิม'
    },
    target: {
        zh: '目标',
        en: 'Target ',
        kor: '목표 ',
        jp: 'ターゲット',
        th: 'เป้าหมาย'
    },
    onlyStore: {
        zh: '仅限当前门店',
        en: 'Only for current store',
        kor: '현재 매장에만 적용됩니다',
        jp: '現在の店舗にのみ適用されます',
        th: 'เป็นเดิมเฉพาะ ร้านค้า'
    },
    detailImage: {
        zh: '详情图',
        en: 'Detail Image',
        kor: '상세 이미지',
        jp: '詳細 イメージ',
        th: 'รูปภาพข้อมูล'
    },
    tagPrice: {
        zh: '吊牌价',
        en: 'Tag Price',
        kor: '태그 가격',
        jp: 'タグ 価格',
        th: 'ราคาต่อหน่วย'
    },
    inventory: {
        zh: '库存',
        en: 'Inventory',
        kor: '재고',
        jp: '在庫',
        th: 'คงเหลือ'
    },
    size: {
        zh: '尺码',
        en: 'Size',
        kor: '사이즈',
        jp: 'サイズ',
        th: 'ขนาด'
    },
    color: {
        zh: '颜色',
        en: 'Color',
        kor: '색상',
        jp: 'カラー',
        th: 'สี'
    },
    barcode: {
        zh: '条码',
        en: 'Barcode ',
        kor: '바코드',
        jp: 'バーコード',
        th: 'บาร์โค๊ด'
    },
    brand: {
        zh: '品牌',
        en: 'Brand',
        kor: '브랜드',
        jp: 'ブランド',
        th: 'ยี่ห้อ'
    },
    store: {
        zh: '门店',
        en: 'Store',
        kor: '매장',
        jp: '店舗',
        th: 'ร้านค้า'
    },
    counter: {
        zh: '专柜',
        en: 'Counter',
        kor: '대리점',
        jp: 'カウンター',
        th: 'ตั๋ว'
    },
    preview: {
        zh: '预览',
        en: 'Preview',
        kor: '미리보기',
        jp: 'プレビュー',
        th: 'ดูแล้ว'
    },
    unify: {
        zh: '统一',
        en: 'Unify ',
        kor: '통일',
        jp: '統一',
        th: 'เป็นเลข'
    },
    unifyPrice: {
        zh: '统一价',
        en: 'Unify Price',
        kor: '통일가격',
        jp: '統一価格',
        th: 'เป็นเลข'
    },
    inputTime: {
        zh: '录入时间',
        en: 'Input Time',
        kor: '입력시간',
        jp: '入力時間',
        th: 'เป็นเลข'
    },
    editTime: {
        zh: '修改时间',
        en: 'Edit Time',
        kor: '수정시간',
        jp: '編集時間',
        th: 'เป็นเลข'
    },
    editSuccess:{
        zh: '修改成功',
        en: 'Edit Success',
        kor: '수정성공',
        jp: '編集成功',
        th: 'เป็นเลข'
    }
}