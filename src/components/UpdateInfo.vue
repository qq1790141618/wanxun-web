<template>
    <t-dialog
    v-model:visible="visible"
    :footer="false"
    >
        <template #header>
            🌈
            {{ title[i18n.language] }}
        </template>
        <div v-if="i18n.language == 'zh'">
            <h3>🚀 Features</h3>
            <p>
                <t-tag theme="primary" variant="light" size="small">Shop</t-tag>
                新增对于“杭州滨江银泰广场（HZ20）-KCOR（kcor）”的专柜链接
            </p>
            <p>
                <t-tag theme="primary" variant="light" size="small">Dialog</t-tag>
                新增对于更新优化的内容提示
            </p>
            <h3>🚫 Removes</h3>
            <p>
                <t-tag theme="danger" variant="light" size="small">IM</t-tag>
                移除“<t-icon name="chat-double" />即时通讯IM”功能，以及在导航栏的相关链接ICON
            </p>
        </div>
        <div v-if="i18n.language == 'en'">
            <h3>🚀 Features</h3>
            <p>
                <t-tag theme="primary" variant="light" size="small">Shop</t-tag>
                Add a counter link for "Hangzhou Binjiang Intime Plaza (HZ20) - KCOR (kcor)"
            </p>
            <p>
                <t-tag theme="primary" variant="light" size="small">Dialog</t-tag>
                Add content prompts for updating and optimizing
            </p>
            <h3>🚫 Removes</h3>
            <p>
                <t-tag theme="danger" variant="light" size="small">IM</t-tag>
                Remove the "<t-icon name="chat-double" />instant messaging IM" function and the relevant links in the navigation bar ICON
            </p>
        </div>
        <div v-if="i18n.language == 'jp'">
            <h3>🚀 Features</h3>
            <p>
                <t-tag theme="primary" variant="light" size="small">Shop</t-tag>
                「杭州濱江銀泰広場（HZ 20）-KCOR（KCOR）」カウンターリンクを追加
            </p>
            <p>
                <t-tag theme="primary" variant="light" size="small">Dialog</t-tag>
                更新と最適化のためのコンテンツプロンプトの追加
            </p>
            <h3>🚫 Removes</h3>
            <p>
                <t-tag theme="danger" variant="light" size="small">IM</t-tag>
                「インスタントメッセージングIM」機能の削除、およびナビゲーションバーへの関連リンクICON
            </p>
        </div>
        <div v-if="i18n.language == 'kor'">
            <h3>🚀 Features</h3>
            <p>
                <t-tag theme="primary" variant="light" size="small">Shop</t-tag>
                "항저우빈강은태광장(HZ20)-KCOR(KCOR)" 카운터 링크 추가
            </p>
            <p>
                <t-tag theme="primary" variant="light" size="small">Dialog</t-tag>
                업데이트 및 최적화를 위한 내용 힌트 추가
            </p>
            <h3>🚫 Removes</h3>
            <p>
                <t-tag theme="danger" variant="light" size="small">IM</t-tag>
                인스턴트 메시징 IM 기능을 제거하고 관련 링크 ICON을 탐색 모음에 연결
            </p>
        </div>
        <div v-if="i18n.language == 'fra'">
            <h3>🚀 Features</h3>
            <p>
                <t-tag theme="primary" variant="light" size="small">Shop</t-tag>
                Ajoutez un lien vers le comptoir "Hangzhou Binjiang yintay Plaza (hz20) - kcor (kcor)"
            </p>
            <p>
                <t-tag theme="primary" variant="light" size="small">Dialog</t-tag>
                Ajouter des conseils de contenu pour les mises à jour et les optimisations
            </p>
            <h3>🚫 Removes</h3>
            <p>
                <t-tag theme="danger" variant="light" size="small">IM</t-tag>
                Supprimez la fonction de messagerie instantanée et connectez le lien associé icon à la barre de navigation
            </p>
        </div>
        <div v-if="i18n.language == 'cht'">
            <h3>🚀 Features</h3>
            <p>
                <t-tag theme="primary" variant="light" size="small">Shop</t-tag>
                添加“杭州濱江銀泰廣場（HZ20）-KCOR（KCOR）”櫃檯連結
            </p>
            <p>
                <t-tag theme="primary" variant="light" size="small">Dialog</t-tag>
                為更新和優化添加內容提示
            </p>
            <h3>🚫 Removes</h3>
            <p>
                <t-tag theme="danger" variant="light" size="small">IM</t-tag>
                删除即時消息功能並將相關連結圖示連接到巡覽列
            </p>
        </div>
        <div v-if="i18n.language == 'th'">
            <h3>🚀 Features</h3>
            <p>
                <t-tag theme="primary" variant="light" size="small">Shop</t-tag>
                เพิ่มการเชื่อมต่อเคาน์เตอร์ "Yintai Plaza Hangzhou Binjiang (HZ20) - KCOR (KCOR)"
            </p>
            <p>
                <t-tag theme="primary" variant="light" size="small">Dialog</t-tag>
                เพิ่มเคล็ดลับเนื้อหาสำหรับการอัปเดตและการเพิ่มประสิทธิภาพ
            </p>
            <h3>🚫 Removes</h3>
            <p>
                <t-tag theme="danger" variant="light" size="small">IM</t-tag>
                ลบคุณลักษณะการส่งข้อความโต้ตอบแบบทันทีและเชื่อมต่อไอคอนลิงก์ที่เกี่ยวข้องไปยังแถบนำทาง
            </p>
        </div>
        <t-space style="padding: 6px 15px; background-color: var(--td-brand-color-focus); border-radius: 5px;" size="5px" align="center">
            <t-icon name="chevron-right" /> Powered by Limit Au
        </t-space>
    </t-dialog>
</template>

<script setup>
import app from '../../package.json'
const visible = ref(false)
const i18n = inject('i18n')
const title = {
    'zh': '更新说明',
    'en': 'Update instructions',
    'jp': '更新説明',
    'kor': '업데이트 설명',
    'fra': 'Instructions de mise à jour',
    'cht': '更新說明',
    'th': 'คำแนะนำการอัปเดต'
}
onMounted(() => {
    var version = localStorage.getItem('version')
    if(version != app.version){
        visible.value = true
    }
    localStorage.setItem('version', app.version)
})
</script>

<style>

</style>