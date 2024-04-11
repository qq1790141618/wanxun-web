<template>
    <t-dialog
    v-model:visible="visible"
    :footer="false"
    width="800"
    placement="center"
    >
        <template #header>
            🌈
            {{ title[i18n.language] }} v{{app.version}}
        </template>
        <div class="scrollbar">
            <h3>🚀 Features</h3>
            <div class="part" style="width: 100%">
                <t-tag theme="primary" variant="light" style="margin-bottom: 5px;">Manage</t-tag>
                <div>
                    <div>
                        新增菜单“管理”，以及子菜单“用户管理”，“用户组管理”，“App管理”，“店铺管理”
                    </div>
                    <div>
                        New menu "Management" and submenus "User Management", "User Group Management", "App Management", "Shop Management" added.
                    </div>
                </div>
            </div>
            <div class="part" style="width: 100%">
                <t-tag theme="primary" variant="light" style="margin-bottom: 5px;">Import</t-tag>
                <div>
                    <div>
                        修改导入方式规则，使整体更智能，出错率降低。
                    </div>
                    <div>
                        Modify the import method rules to make the overall system more intelligent and reduce error rates.
                    </div>
                </div>
            </div>
            <div class="part" style="width: 100%">
                <t-tag theme="primary" variant="light" style="margin-bottom: 5px;">Update</t-tag>
                <div>
                    <div>
                        新增页面更新自动检测
                    </div>
                    <div>
                        Automatic detection of new page updates.
                    </div>
                </div>
            </div>
            <h3>🌈 Changes</h3>
            <div class="part" style="width: 100%">
                <t-tag theme="primary" variant="light" style="margin-bottom: 5px;">Frame</t-tag>
                <div>
                    <div>
                        修改API请求方式为带签名请求，使数据更安全，并且权限可控。
                    </div>
                    <div>
                        Modify the API request method to include signed requests to make data more secure and permissions controllable.
                    </div>
                </div>
            </div>
            <h3>🚫 Removes</h3>
            <div class="part" style="width: 100%">
                <t-tag theme="danger" variant="light" style="margin-bottom: 5px;">Source</t-tag>
                <div>
                    <div>
                        停用功能“返回旧版网页”
                    </div>
                    <div>
                        Deactivate feature 'Return to old version webpage'.
                    </div>
                </div>
            </div>
            <div class="part" style="width: 100%">
                <t-tag theme="danger" variant="light" style="margin-bottom: 5px;">Source</t-tag>
                <div>
                    <div>
                        移除页面“开源代码”
                    </div>
                    <div>
                        Remove page "open source code"
                    </div>
                </div>
            </div>
            <div class="part" style="width: 100%">
                <t-tag theme="danger" variant="light" style="margin-bottom: 5px;">Language</t-tag>
                <div>
                    <div>
                        移除语言“泰语”
                    </div>
                    <div>
                        Remove language "Thai"
                    </div>
                </div>
            </div>
        </div>
        <div class="sign">
            <t-icon name="chevron-right" /> Powered by Limit Au
        </div>
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
    'cht': '更新說明'
}
onMounted(() => {
    const version = localStorage.getItem('version');
    if(version !== app.version){
        visible.value = true
    }
    localStorage.setItem('version', app.version)
})
</script>

<style scoped>
.part {
    font-size: 12px;
    margin: 12px 0 6px 0;
    display: flex;
    gap: 26px;
}
.scrollbar {
    max-height: 65vh;
    overflow-x: visible;
    overflow-y: auto;
}
.sign {
    display: inline-block;
    margin-top: 16px;
    padding: 6px 15px;
    background-color: var(--td-brand-color-focus);
    border-radius: 5px;
}
</style>