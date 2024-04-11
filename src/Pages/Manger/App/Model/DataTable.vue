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
        text: getString('loading')
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
                    {{ getString('downloadPackage') }}
                </t-button>
                <t-button
                v-if="!user.inform['need_auth'] || user.inform['api_p'].indexOf('api/v1/app/version/publish') >= 0"
                @click="$emit('edit', scope.rowIndex)"
                size="small"
                >
                    <template #icon>
                        <t-icon name="edit" />
                    </template>
                    {{ getString('editPackage') }}
                </t-button>
            </t-space>
        </template>
    </t-table>
</template>

<script setup>
import { Icon } from 'tdesign-vue-next'
import Controller from '../Controller.js'
import {getString} from "../../../../i18n/index.js";
import {tips} from "../../../../hooks/tips.js";

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
        title: getString('packageId'),
        align: 'center'
    },
    {
        colKey: 'platform',
        title: getString('platform'),
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
        title: getString('version'),
        align: 'center'
    },
    {
        colKey: 'version_id',
        title: getString('versionId'),
        align: 'center'
    },
    {
        colKey: 'platform',
        title: getString('versionType'),
        align: 'center',
        cell: (_, { row }) => {
            const versionType = Controller.versionTypeOptions.find(item => item.value === row.version_type);
            return h('span', versionType.label)
        }
    },
    {
        colKey: 'size',
        title: getString('packageSize'),
        align: 'center',
        cell: (_, { row }) => {
            return h('span', row.package_size + ' Byte')
        }
    },
    {
        colKey: 'publish',
        title: getString('publishTime'),
        align: 'center'
    },
    {
        colKey: 'package_update_information',
        title: getString('updateInfo'),
        align: 'center'
    },
    {
        colKey: 'operate',
        title: getString('operate'),
        align: 'center'
    }
]
const pagination = {
    size: 'small',
    defaultPageSize: 10,
    showSizePicker: true,
    pageSizes: [5, 10, 15, 20],
    total: props.data.length,
}
const openUrl = (url) => {
    window.open(url, '_blank')
}
</script>

<style>

</style>