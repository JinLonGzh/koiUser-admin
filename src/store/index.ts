import {defineStore} from "pinia";

export const useStore = defineStore('main', {
    state: () => ({
        collapse: false,
        tabList: [{name: '首页', path: '/'}],
        userId: null,
        roleList: null,
        avatar: null,
        nickname: null,
        intro: null,
        userMenuList: [],
    }),
    actions: {
        saveTab(tab: any) {
            if (this.tabList.findIndex(item => item.path === tab.path) === -1) {
                this.tabList.push({name: tab.name, path: tab.path});
            }
        },
        removeTab(tab: any) {
            const index = this.tabList.findIndex(item => item.name === tab.name);
            this.tabList.splice(index, 1);
        },
        resetTab() {
            this.tabList = [{name: '首页', path: '/'}];
        },
        trigger() {
            this.collapse = !this.collapse;
        },
        login(user: any) {
            this.userId = user.userInfoId;
            this.roleList = user.roleList;
            this.avatar = user.avatar;
            this.nickname = user.nickname;
            this.intro = user.intro;
        },
        saveUserMenuList(userMenuList: any) {
            this.userMenuList = userMenuList;
        },
        logout() {
            this.userId = null;
            this.roleList = null;
            this.avatar = null;
            this.nickname = null;
            this.intro = null;
            this.userMenuList = [];
        },
        updateAvatar(avatar: any) {
            this.avatar = avatar;
        },
        updateUserInfo(user: any) {
            this.nickname = user.nickname;
            this.intro = user.intro;
        },
    },
})