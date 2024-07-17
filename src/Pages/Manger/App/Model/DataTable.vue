<template>
    <t-table
        size="small"
        :data="data"
        :columns="columns"
        max-height="calc(100vh - 230px)"
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
                    @click="openUrl(scope.row.resource)"
                    variant="outline"
                    size="small"
                >
                    <template #icon>
                        <t-icon name="download" />
                    </template>
                    {{ getString('downloadPackage') }}
                </t-button>
                <t-button
                    @click="$emit('edit', JSON.parse(JSON.stringify(scope.rowIndex)))"
                    size="small"
                >
                    <template #icon>
                        <t-icon name="edit" />
                    </template>
                    {{ getString('editPackage') }}
                </t-button>
                <t-popconfirm
                    theme="danger"
                    :content="getString('removePackageTip')"
                    @confirm="$emit('delete', scope.row.id)"
                >
                    <t-button
                        theme="danger"
                        size="small"
                    >
                        <template #icon>
                            <t-icon name="delete" />
                        </template>
                        {{ getString('removePackage') }}
                    </t-button>
                </t-popconfirm>
            </t-space>
        </template>
    </t-table>
</template>

<script setup>
import Controller from '../Controller.js'
import { Icon } from 'tdesign-vue-next'
import { getString } from "../../../../i18n/index.js"

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
const emits = defineEmits(['edit', 'delete'])
const columns = [
    {
        colKey: 'id',
        title: getString('packageId'),
        align: 'center'
    },
    {
        colKey: 'platform',
        title: getString('platform'),
        align: 'center',
        cell: (_, { row }) => {
            const platform = Controller.platformOptions.find(item => item.value === row.platform)
            if (platform) {
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
        }
    },
    {
        colKey: 'version',
        title: getString('version'),
        align: 'center'
    },
    {
        colKey: 'versionId',
        title: getString('versionId'),
        align: 'center'
    },
    {
        colKey: 'platform',
        title: getString('versionType'),
        align: 'center',
        cell: (_, { row }) => {
            const versionType = Controller.versionTypeOptions.find(item => item.value === row.type)
            if (versionType) return h('span', versionType.label)
        }
    },
    {
        colKey: 'size',
        title: getString('packageSize'),
        align: 'center',
        cell: (_, { row }) => {
            if (row.size < 1024) {
                return row.size + ' Byte'
            } else if (row.size < 1024 * 1024) {
                return (row.size / 1024).toFixed(2) + ' KB'
            } else {
                return (row.size / 1024 / 1024).toFixed(2) + ' MB'
            }
        }
    },
    {
        colKey: 'publish',
        title: getString('publishTime'),
        align: 'center'
    },
    {
        colKey: 'info',
        title: getString('updateInfo'),
        align: 'center'
    },
    {
        colKey: 'operate',
        title: getString('operate'),
        align: 'center'
    }
]
const openUrl = (url) => {
    window.open(url, '_blank')
}
</script>

<style>

</style>