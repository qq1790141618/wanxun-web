<template>
    <t-table
    size="small"
    :data="data"
    :columns="columns"
    max-height="calc(100vh - 250px)"
    :pagination="pagination"
    table-layout="auto"
    :loading="loading"
    :loading-props="{
        indicator: false,
        text: i18n['loading'][i18n.language]
    }"
    >
        <template #operate="scope">
            <t-space size="5px">
                <t-button
                @click="openUrl(scope.row.package_resource)"
                variant="outline"
                size="small"
                >
                    <template #icon>
                        <t-icon name="download" />
                    </template>
                    {{ i18n['downloadPackage'][i18n.language] }}
                </t-button>
                <t-button
                v-if="!user.inform['need_auth'] || user.inform['api_p'].indexOf('api/v1/app/version/publish') >= 0"
                @click="$emit('edit', scope.rowIndex)"
                size="small"
                >
                    <template #icon>
                        <t-icon name="edit" />
                    </template>
                    {{ i18n['editPackage'][i18n.language] }}
                </t-button>
            </t-space>
        </template>
    </t-table>
</template>

<script setup>
import { Icon } from 'tdesign-vue-next'
import Controller from '../Controller.js'
import {getContent} from "../../../../i18n/index.js";
import {tips} from "../../../../hooks/tips.js";

const i18n = inject('i18n')
const user = inject('user')
const props = defineProps({
    data: {
        type: Array,
        require: true
    },
    loading: {
        type: Boolean,
        default: false
    }
})
const emits = defineEmits(['edit'])
const columns = [
    {
        colKey: 'package_id',
        title: getContent('packageId'),
        align: 'center'
    },
    {
        colKey: 'platform',
        title: getContent('platform'),
        align: 'center',
        cell: (_, { row }) => {
            var platform = Controller.platformOptions.find(item => item.value === row.platform)
            
            return h('div', [
                h(Icon, {
                    name: platform.icon,
                    style: {
                        paddingRight: '5px'
                    }
                }),
                h('span', platform.label)
            ])
        }
    },
    {
        colKey: 'version',
        title: getContent('version'),
        align: 'center'
    },
    {
        colKey: 'version_id',
        title: getContent('versionId'),
        align: 'center'
    },
    {
        colKey: 'platform',
        title: getContent('versionType'),
        align: 'center',
        cell: (_, { row }) => {
            const versionType = Controller.versionTypeOptions.find(item => item.value === row.version_type);
            return h('span', versionType.label)
        }
    },
    {
        colKey: 'size',
        title: getContent('packageSize'),
        align: 'center',
        cell: (_, { row }) => {
            return h('span', row.package_size + ' Byte')
        }
    },
    {
        colKey: 'publish',
        title: getContent('publishTime'),
        align: 'center'
    },
    {
        colKey: 'package_update_information',
        title: getContent('updateInfo'),
        align: 'center'
    },
    {
        colKey: 'operate',
        title: getContent('operate'),
        align: 'center'
    }
]
const pagination = {
    size: 'small',
    defaultPageSize: 10,
    showSizePicker: true,
    pageSizes: [5, 10, 15, 20],
    total: props.data.length,
    showTotal: (total) => `共 ${total} 条数据`
}
const openUrl = (url) => {
    window.open(url, '_blank')
}
</script>

<style>

</style>