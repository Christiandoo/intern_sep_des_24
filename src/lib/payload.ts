export function createPayload(form: HTMLFormElement) {
  const formData = new FormData(form);

  return {
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
    role: formData.get("role") as string, // ✅ TAMBAH
  };
}
