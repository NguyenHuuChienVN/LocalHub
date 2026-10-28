import { useState } from "react";
import { changePassword } from "../../api/services/profile";

type ProfileSecurityDialogProps = {
	token: string;
	onClose: () => void;
};

export default function ProfileSecurityDialog({ token, onClose }: ProfileSecurityDialogProps) {
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError("");
		setSuccess("");

		if (newPassword.length < 6) {
			setError("Mật khẩu mới cần có ít nhất 6 ký tự.");
			return;
		}
		if (newPassword !== confirmPassword) {
			setError("Mật khẩu xác nhận chưa khớp.");
			return;
		}

		setIsSubmitting(true);
		try {
			await changePassword(token, currentPassword, newPassword);
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
			setSuccess("Mật khẩu đã được cập nhật.");
		} catch (submitError) {
			setError(submitError instanceof Error ? submitError.message : "Không thể đổi mật khẩu. Vui lòng thử lại.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 px-4 py-8" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
			<section aria-labelledby="security-dialog-title" aria-modal="true" className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl sm:p-6" role="dialog">
				<h2 className="text-lg font-black text-slate-900" id="security-dialog-title">Quản lý bảo mật</h2>
				<p className="mt-1 text-sm text-slate-500">Đổi mật khẩu để bảo vệ tài khoản của bạn.</p>
				<form className="mt-5 space-y-4" onSubmit={handleSubmit}>
					<label className="block text-sm font-semibold text-slate-700">Mật khẩu hiện tại
						<input autoComplete="current-password" className="mt-1.5 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" onChange={(event) => setCurrentPassword(event.target.value)} required type="password" value={currentPassword} />
					</label>
					<label className="block text-sm font-semibold text-slate-700">Mật khẩu mới
						<input autoComplete="new-password" className="mt-1.5 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" minLength={6} onChange={(event) => setNewPassword(event.target.value)} required type="password" value={newPassword} />
					</label>
					<label className="block text-sm font-semibold text-slate-700">Xác nhận mật khẩu mới
						<input autoComplete="new-password" className="mt-1.5 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" onChange={(event) => setConfirmPassword(event.target.value)} required type="password" value={confirmPassword} />
					</label>
					<p className="rounded-lg bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600">Xác thực 2 bước chưa được cấu hình cho hệ thống.</p>
					{error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>}
					{success && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700" role="status">{success}</p>}
					<div className="flex justify-end gap-2 pt-1">
						<button className="min-h-10 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={onClose} type="button">Đóng</button>
						<button className="min-h-10 rounded-lg bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50" disabled={isSubmitting} type="submit">{isSubmitting ? "Đang cập nhật..." : "Đổi mật khẩu"}</button>
					</div>
				</form>
			</section>
		</div>
	);
}
