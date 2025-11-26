import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
const AuthPanel = ({ onLogin, onRegister, busy, error, clearError }) => {
    const [mode, setMode] = useState('login');
    const [form, setForm] = useState({ email: '', password: '', displayName: '' });
    const handleSubmit = async (evt) => {
        evt.preventDefault();
        clearError();
        if (mode === 'login') {
            await onLogin({ email: form.email, password: form.password });
        }
        else {
            await onRegister(form);
        }
    };
    return (_jsx("div", { className: "auth-container", children: _jsxs("div", { className: "auth-card", children: [_jsxs("div", { className: "auth-header", children: [_jsx("div", { className: "auth-logo", children: _jsxs("div", { className: "sudoku-grid", children: [_jsx("div", { className: "sudoku-cell" }), _jsx("div", { className: "sudoku-cell filled" }), _jsx("div", { className: "sudoku-cell" }), _jsx("div", { className: "sudoku-cell" }), _jsx("div", { className: "sudoku-cell filled" }), _jsx("div", { className: "sudoku-cell" }), _jsx("div", { className: "sudoku-cell" }), _jsx("div", { className: "sudoku-cell filled" }), _jsx("div", { className: "sudoku-cell" })] }) }), _jsx("h1", { className: "auth-title", children: "Sudoku Arena" }), _jsx("p", { className: "auth-subtitle", children: "\u6311\u6218\u601D\u7EF4\u6781\u9650\uFF0C\u5F81\u670D\u6570\u5B57\u8FF7\u5BAB" })] }), _jsxs("div", { className: "auth-tabs", children: [_jsx("button", { className: `auth-tab ${mode === 'login' ? 'active' : ''}`, type: "button", onClick: () => {
                                setMode('login');
                                clearError();
                            }, children: "\u767B\u5F55" }), _jsx("button", { className: `auth-tab ${mode === 'register' ? 'active' : ''}`, type: "button", onClick: () => {
                                setMode('register');
                                clearError();
                            }, children: "\u6CE8\u518C" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "auth-form", children: [mode === 'register' && (_jsxs("div", { className: "input-group", children: [_jsx("label", { htmlFor: "displayName", children: "\u6635\u79F0" }), _jsx("input", { id: "displayName", type: "text", value: form.displayName, onChange: (e) => setForm((f) => ({ ...f, displayName: e.target.value })), placeholder: "\u8BF7\u8F93\u5165\u60A8\u7684\u6635\u79F0", required: true, minLength: 2 })] })), _jsxs("div", { className: "input-group", children: [_jsx("label", { htmlFor: "email", children: "\u90AE\u7BB1" }), _jsx("input", { id: "email", type: "email", value: form.email, onChange: (e) => setForm((f) => ({ ...f, email: e.target.value })), placeholder: "\u8BF7\u8F93\u5165\u90AE\u7BB1\u5730\u5740", required: true })] }), _jsxs("div", { className: "input-group", children: [_jsx("label", { htmlFor: "password", children: "\u5BC6\u7801" }), _jsx("input", { id: "password", type: "password", value: form.password, onChange: (e) => setForm((f) => ({ ...f, password: e.target.value })), placeholder: "\u8BF7\u8F93\u5165\u5BC6\u7801\uFF08\u81F3\u5C118\u4F4D\uFF09", required: true, minLength: 8 })] }), error && (_jsxs("div", { className: "auth-error", children: [_jsx("span", { children: "\u26A0\uFE0F" }), error] })), _jsx("button", { type: "submit", className: "auth-submit-btn", disabled: busy, children: busy ? (_jsx("span", { className: "loading-spinner" })) : (mode === 'login' ? '登录游戏' : '创建账号') })] }), _jsx("div", { className: "auth-footer", children: _jsxs("p", { className: "auth-footer-text", children: [mode === 'login' ? '还没有账号？' : '已有账号？', _jsx("button", { className: "auth-link", type: "button", onClick: () => {
                                    setMode(mode === 'login' ? 'register' : 'login');
                                    clearError();
                                }, children: mode === 'login' ? '立即注册' : '立即登录' })] }) })] }) }));
};
export default AuthPanel;
