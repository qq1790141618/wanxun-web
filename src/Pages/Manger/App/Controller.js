import {getString} from "../../../i18n/index.js";

export default {
    platformOptions: [
        {
            label: getString('platform-android'),
            icon: 'logo-android',
            value: 'android',
            suffix: '.apk'
        },
        {
            label: getString('platform-windows'),
            icon: '',
            value: 'windows',
            suffix: '.exe, .msi'
        },
        {
            label: getString('platform-ios'),
            icon: 'logo-apple',
            value: 'ios',
            suffix: '.ipa'
        },
        {
            label: getString('platform-mac'),
            icon: 'logo-apple',
            value: 'macos',
            suffix: '.dmg, .pkg'
        },
        {
            label: getString('other'),
            icon: '',
            value: 'other',
            suffix: '*'
        }
    ],
    versionTypeOptions: [
        {
            label: getString('release'),
            value: 'release'
        },
        {
            label: getString('beta'),
            value: 'beta'
        },
        {
            label: getString('dev'),
            value: 'dev'
        }
    ]
}