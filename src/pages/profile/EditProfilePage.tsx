import { ArrowLeft, Save, UserRound } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router";
import { z } from "zod";
import { getAuthUser, updateAuthUser } from "../../features/auth/authStorage";

const profileSchema = z.object({
	name: z.string().trim().min(1, "Vui lòng nhập họ tên").max(100, "Họ tên tối đa 100 ký tự"),
	phone: z.string().trim().refine((value) => !value || /^\+?\d{7,15}$/.test(value), "Số điện thoại không hợp lệ"),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function EditProfilePage() {
	const authUser = getAuthUser();
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors, isDirty, isSubmitting },
	} = useForm<ProfileForm>({
		resolver: zodResolver(profileSchema),
		defaultValues: { name: authUser?.name ?? "", phone: authUser?.phone ?? "" },
	});

	if (!authUser) {
		return <Navigate replace to="/login" />;
	}

	function onSubmit({ name, phone }: ProfileForm) {
		updateAuthUser({ name, phone: phone || null });
		navigate("/profile", { replace: true, state: { profileUpdated: true } });
	}

	return (
		<main className="min-h-[calc(100vh-136px)] bg-slate-50 px-4 py-8 text-slate-900 sm:px-8 sm:py-10">
			<section className="mx-auto max-w-3xl">
				<Link className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600" replace to="/profile"><ArrowLeft className="h-4 w-4" /> Hồ sơ của tôi</Link>
				<div className="mt-5 flex items-center gap-3">
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-950 text-sm font-bold text-blue-300">{authUser.name.slice(0, 2).toUpperCase() || <UserRound className="h-5 w-5" />}</div>
					<div><h1 className="text-xl font-black">Chỉnh sửa hồ sơ</h1><p className="mt-1 text-sm text-slate-500">Cập nhật thông tin tài khoản</p></div>
				</div>

				<form className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-7" onSubmit={handleSubmit(onSubmit)} noValidate>
					<div className="grid gap-5 sm:grid-cols-2">
						<label className="block text-sm font-semibold text-slate-700">Họ và tên
							<input autoComplete="name" className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" maxLength={100} {...register("name")} />
							{errors.name && <span className="mt-1 block text-xs font-normal text-red-600">{errors.name.message}</span>}
						</label>
						<label className="block text-sm font-semibold text-slate-700">Email
							<input className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-normal text-slate-500" readOnly value={authUser.email} />
						</label>
						<label className="block text-sm font-semibold text-slate-700 sm:max-w-sm">Số điện thoại
							<input autoComplete="tel" className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" inputMode="tel" placeholder="Ví dụ: 0912345678" type="tel" {...register("phone")} />
							{errors.phone && <span className="mt-1 block text-xs font-normal text-red-600">{errors.phone.message}</span>}
						</label>
					</div>
					<div className="mt-7 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-5">
						<Link className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50" replace to="/profile">Hủy</Link>
						<button className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50" disabled={!isDirty || isSubmitting} type="submit"><Save className="h-4 w-4" /> {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}</button>
					</div>
				</form>
			</section>
		</main>
	);
}