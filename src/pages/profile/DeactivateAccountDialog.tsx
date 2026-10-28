import { useState } from "react";
import { deactivateAccount } from "../../api/services/profile";

type DeactivateAccountDialogProps = {
	token: string;
	onCancel: () => void;
	onDeactivated: () => void;
};

export default function DeactivateAccountDialog({ token, onCancel, onDeactivated }: DeactivateAccountDialogProps) {
	const [currentPassword, setCurrentPassword] = useState("");
	const [confirmation, setConfirmation] = useState("");
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError("");
		setIsSubmitting(true);
		try {
			await deactivateAccount(token, currentPassword);
			onDeactivated();
		} catch (submitError) {
			setError(submitError instanceof Error ? submitError.message : "Không thể vô hiệu hóa tài khoản. Vui lòng thử lại.");
			setIsSubmitting(false);
		}
	}

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 px-4 py-8" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
			<section aria-labelledby="deactivate-dialog-title" aria-modal="true" className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl sm:p-6" role="alertdialog">
				<h2 className="text-lg font-black text-slate-900" id="deactivate-dialog-title">Vô hiệu hóa tài khoản?</h2>
				<p className="mt-2 text-sm leading-5 text-slate-600">Bạn sẽ bị đăng xuất và không thể đăng nhập lại. Dữ liệu được giữ lại để có thể khôi phục qua bộ phận hỗ trợ.</p>
				<form className="mt-5 space-y-4" onSubmit={handleSubmit}>
					<label className="block text-sm font-semibold text-slate-700">Mật khẩu hiện tại
						<input autoComplete="current-password" className="mt-1.5 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm font-normal outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100" onChange={(event) => setCurrentPassword(event.target.value)} required type="password" value={currentPassword} />
					</label>
					<label className="block text-sm font-semibold text-slate-700">Nhập <span className="font-black">VOHIEUHOA</span> để xác nhận
						<input autoComplete="off" className="mt-1.5 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm font-normal outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100" onChange={(event) => setConfirmation(event.target.value)} required value={confirmation} />
					</label>
					{error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>}
					<div className="flex justify-end gap-2 pt-1">
						<button className="min-h-10 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={onCancel} type="button">Hủy</button>
						<button className="min-h-10 rounded-lg border border-red-300 bg-white px-4 text-sm font-bold text-red-700 hover:bg-red-50 disabled:opacity-50" disabled={isSubmitting || confirmation !== "VOHIEUHOA"} type="submit">{isSubmitting ? "Đang xử lý..." : "Vô hiệu hóa tài khoản"}</button>
					</div>
				</form>
			</section>
		</div>
	);
}
