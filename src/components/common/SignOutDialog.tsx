import { useEffect, useRef, type KeyboardEvent } from "react";
import { LogOut, X } from "lucide-react";

type SignOutDialogProps = {
	onCancel: () => void;
	onConfirm: () => void;
};

export default function SignOutDialog({ onCancel, onConfirm }: SignOutDialogProps) {
	const dialogRef = useRef<HTMLElement>(null);
	const cancelButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		cancelButtonRef.current?.focus();
		const handleKeyDown = (event: globalThis.KeyboardEvent) => {
			if (event.key === "Escape") {
				event.preventDefault();
				onCancel();
				return;
			}

			if (event.key === "Tab") {
				const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled])") ?? [];
				const firstElement = focusableElements[0];
				const lastElement = focusableElements[focusableElements.length - 1];

				if (event.shiftKey && document.activeElement === firstElement) {
					event.preventDefault();
					lastElement?.focus();
				} else if (!event.shiftKey && document.activeElement === lastElement) {
					event.preventDefault();
					firstElement?.focus();
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [onCancel]);

	function handleBackdropClick(event: React.MouseEvent<HTMLDivElement>) {
		if (event.target === event.currentTarget) onCancel();
	}

	function handleDialogKeyDown(event: KeyboardEvent<HTMLElement>) {
		if (event.key === "Tab") event.stopPropagation();
	}

	return (
		<div className="sign-out-dialog-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 px-4 py-8 backdrop-blur-[2px]" onMouseDown={handleBackdropClick} role="presentation">
			<section aria-labelledby="sign-out-title" aria-modal="true" className="sign-out-dialog-panel w-full max-w-sm rounded-lg border border-slate-200 bg-white p-5 shadow-2xl sm:p-6" onKeyDown={handleDialogKeyDown} ref={dialogRef} role="dialog" tabIndex={-1}>
				<div className="flex items-start justify-between gap-4">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600"><LogOut aria-hidden="true" className="h-5 w-5" /></div>
					<button aria-label="Đóng hộp thoại" className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" onClick={onCancel} type="button"><X className="h-4 w-4" /></button>
				</div>
				<h2 className="mt-4 text-lg font-black text-slate-900" id="sign-out-title">Bạn muốn đăng xuất?</h2>
				<p className="mt-1.5 text-sm leading-5 text-slate-600">Bạn sẽ cần đăng nhập lại để sử dụng tài khoản.</p>
				<div className="mt-6 flex justify-end gap-2">
					<button className="min-h-10 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50" onClick={onCancel} ref={cancelButtonRef} type="button">Hủy</button>
					<button className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-bold text-white transition hover:bg-red-700" onClick={onConfirm} type="button"><LogOut aria-hidden="true" className="h-4 w-4" /> Đăng xuất</button>
				</div>
			</section>
		</div>
	);
}