import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { z } from "zod";
import logo from "../../../assets/images/logo-nha.png";
import { registerWithEmail } from "../../../api/services/auth";

const registerSchema = z.object({
	name: z.string().trim().min(2, "Vui lòng nhập họ tên"),
	email: z.string().trim().email("Email không hợp lệ"),
	phone: z.string().trim().optional().refine((value) => !value || /^\+?\d{7,15}$/.test(value), "Số điện thoại không hợp lệ"),
	password: z.string().min(6, "Mật khẩu cần có ít nhất 6 ký tự"),
	confirmPassword: z.string(),
}).refine((values) => values.password === values.confirmPassword, {
	message: "Mật khẩu xác nhận không khớp",
	path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [submitError, setSubmitError] = useState("");
	const [registrationComplete, setRegistrationComplete] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

	async function onSubmit({ name, email, password, phone }: RegisterForm) {
		setSubmitError("");
		setRegistrationComplete(false);

		try {
			await registerWithEmail(name, email, password, phone || undefined);
			setRegistrationComplete(true);
		} catch (error) {
			setSubmitError(error instanceof TypeError
				? "Không thể kết nối máy chủ. Hãy kiểm tra backend đang chạy."
				: error instanceof Error ? error.message : "Đăng ký thất bại. Vui lòng thử lại.");
		}
	}

	return (
		<div className="min-h-screen bg-white px-4 py-5 sm:bg-slate-50 sm:px-6 sm:py-10">
			<section className="mx-auto w-full max-w-[440px] sm:rounded-2xl sm:border sm:border-slate-200 sm:bg-white sm:px-10 sm:py-8 sm:shadow-sm">
				<div className="text-center"><img className="mx-auto h-14 w-14 object-contain" src={logo} alt="LocalHub" /><h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900">Local<span className="text-blue-600">-Hub</span></h1></div>
				<div className="mt-10 text-center"><h2 className="text-2xl font-black text-slate-900">Tạo tài khoản</h2><p className="mt-2 text-xs leading-5 text-slate-500">Đăng ký để bắt đầu sử dụng dịch vụ Local-Hub.</p></div>
				<form className="mt-6 space-y-3" onSubmit={handleSubmit(onSubmit)} noValidate>
					<div><label className="sr-only" htmlFor="name">Họ và tên</label><div className="relative"><UserRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input className="h-10 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" id="name" placeholder="Họ và tên" {...register("name")} /></div>{errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}</div>
					<div><label className="sr-only" htmlFor="email">Email</label><div className="relative"><Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input className="h-10 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" id="email" type="email" placeholder="Email" {...register("email")} /></div>{errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}</div>
					<div><label className="sr-only" htmlFor="phone">Số điện thoại</label><div className="relative"><Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input autoComplete="tel" className="h-10 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" id="phone" inputMode="tel" placeholder="Số điện thoại" type="tel" {...register("phone")} /></div>{errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}</div>
					<div>
						<label className="sr-only" htmlFor="password">Mật khẩu</label>
						<div className="relative"><LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
						<input className="auth-password-input h-10 w-full rounded-lg border border-slate-200 px-10 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" id="password" type={showPassword ? "text" : "password"} placeholder="Mật khẩu" {...register("password")} />
						<button aria-label="Hiện hoặc ẩn mật khẩu" className="absolute right-3 top-2.5 text-slate-400" onClick={() => setShowPassword((visible) => !visible)} type="button">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>{errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
						</div>
					<div><label className="sr-only" htmlFor="confirmPassword">Xác nhận mật khẩu</label><div className="relative"><LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input className="auth-password-input h-10 w-full rounded-lg border border-slate-200 px-10 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Nhập lại mật khẩu" {...register("confirmPassword")} /><button aria-label="Hiện hoặc ẩn mật khẩu xác nhận" className="absolute right-3 top-2.5 text-slate-400" onClick={() => setShowConfirmPassword((visible) => !visible)} type="button">{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>{errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>}</div>
					{registrationComplete && <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800" role="status">Đăng ký thành công.</p>}
					{submitError && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs leading-5 text-red-700" role="alert">{submitError}</p>}
					<button className="mt-2 h-10 w-full rounded-lg bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-60" disabled={isSubmitting} type="submit">{isSubmitting ? "Đang tạo tài khoản..." : "Đăng ký"}</button>
				</form>
				<p className="mt-6 text-center text-xs text-slate-500">Đã có tài khoản? <Link className="font-bold text-blue-600" replace to="/login">Đăng nhập</Link></p>
			</section>
		</div>
	);
}