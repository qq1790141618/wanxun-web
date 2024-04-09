export default {
    platformOptions: [
        {
            label: '安卓',
            icon: 'logo-android',
            value: 'android',
            suffix: '.apk'
        },
        {
            label: 'Windows',
            icon: '',
            value: 'windows',
            suffix: '.exe, .msi'
        },
        {
            label: 'iOS',
            icon: 'logo-apple',
            value: 'ios',
            suffix: '.ipa'
        },
        {
            label: 'MacOS',
            icon: 'logo-apple',
            value: 'macos',
            suffix: '.dmg, .pkg'
        },
        {
            label: '其他',
            icon: '',
            value: 'other',
            suffix: '*'
        }
    ],
    versionTypeOptions: [
        {
            label: '正式版',
            value: 'release'
        },
        {
            label: 'Beta测试版',
            value: 'beta'
        },
        {
            label: '开发者测试版',
            value: 'dev'
        }
    ]
}