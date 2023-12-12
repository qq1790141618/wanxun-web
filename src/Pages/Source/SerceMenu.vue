<template>
    <div
    id="source-menu"
    >
        <t-tree
        :data="tree"
        line
        activable
        v-model:actived="activeFile"
        v-model:expanded="expanded"
        expand-on-click-node
        >
        </t-tree>
    </div>
</template>

<script>
import tree from './tree'

export default {
    emits: ['open'],
    setup(props, { emit }){
        const i18n = inject('i18n')

        const orUrl = 'https://cdn.fixeam.com/tw/source-web'
        const activeFile = ref([])
        const expanded = ref([])
        const findnode = (node, value) => {
            for (let i = 0; i < node.length; i++) {
                if (node[i].value === value) {
                    return node[i]
                }

                if(!node[i].children){
                    continue
                }

                const result = findnode(node[i].children, value)
                if (result) {
                    return result
                }
            }

            return false
        }
        
        watch(() => activeFile.value, (newValue) => {
            let node = findnode(tree, newValue[0])
            if(node.type === 'fold'){
                return
            }
            emit('open', orUrl, node)
        })

        onMounted(() => {
            expanded.value = ['/src']
            activeFile.value = ['/src/App.vue']
        })

        return {
            i18n,
            tree,
            activeFile,
            expanded
        }
    }
}
</script>

<style>
#source-menu{
    border-radius: 7px;
    background-color: #fff;
    padding: 10px 16px;
    height: calc(100vh - 110px);
    overflow-y: auto;
}
</style>