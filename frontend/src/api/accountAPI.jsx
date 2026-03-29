import { API_URL } from "../api";

export async function getAccounts() {
    const response = await fetch(`${API_URL}/Register`);

    if (!response.ok) {
        throw new Error("Failed to fetch accounts");
    }

    return await response.json();
}

export async function createAccount(accountData) {
    const formData = new FormData();
    formData.append("id_Register", accountData.id_Register || "");
    formData.append("username", accountData.username);
    formData.append("email", accountData.email || "");
    formData.append("password", accountData.password);
    formData.append("diachi", accountData.diachi || "");
    formData.append("dienthoai", accountData.dienthoai || "");
    formData.append("role", accountData.role);

    const response = await fetch(`${API_URL}/Register/register`, {
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        throw new Error("Failed to create account");
    }

    return await response.json();
}

