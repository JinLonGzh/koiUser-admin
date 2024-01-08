import {decrypt, encrypt} from "@/utils/jsencrypt.ts";


const AccessTokenKey = 'ACCESS_TOKEN'
const RefreshTokenKey = 'REFRESH_TOKEN'

// ========== Token 相关 ==========

export function getAccessToken() {
    return localStorage.getItem(AccessTokenKey)
}

export function getRefreshToken() {
    return localStorage.getItem(RefreshTokenKey)
}

export function setToken(token: any) {
    localStorage.setItem(AccessTokenKey, token.accessToken)
    localStorage.setItem(RefreshTokenKey, token.refreshToken)
}

export function removeToken() {
    localStorage.removeItem(AccessTokenKey)
    localStorage.removeItem(RefreshTokenKey)
}

// ========== 账号相关 ==========

const UsernameKey = 'USERNAME'
const PasswordKey = 'PASSWORD'
const RememberMeKey = 'REMEMBER_ME'

export function getUsername() {
    return localStorage.getItem(UsernameKey)
}

export function setUsername(username: string) {
    localStorage.setItem(UsernameKey, username)
}

export function removeUsername() {
    localStorage.removeItem(UsernameKey)
}

export function getPassword() {
    const password = localStorage.getItem(PasswordKey)
    return password ? decrypt(password) : undefined
}

export function setPassword(password: string) {
    localStorage.setItem(PasswordKey, encrypt(password))
}

export function removePassword() {
    localStorage.removeItem(PasswordKey)
}

export function getRememberMe() {
    return localStorage.getItem(RememberMeKey) === 'true'
}

export function setRememberMe(rememberMe: any) {
    localStorage.setItem(RememberMeKey, rememberMe)
}

export function removeRememberMe() {
    localStorage.removeItem(RememberMeKey)
}