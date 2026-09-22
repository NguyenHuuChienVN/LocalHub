import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import logo from "../../../assets/images/logo-nha.png";
import { saveRegisteredAccount } from "../../../features/auth/authStorage";

const registerSchema = z.object({
	name: z.string().trim().min(2, "Vui lòng nhập họ tên"),
	email: z.string().trim().email("Email không hợp lệ"),
	password: z.string().min(6, "Mật khẩu cần có ít nhất 6 ký tự bao gồm cả chữ và số").regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, "Mật khẩu cần có ít nhất 6 ký tự bao gồm cả chữ và số"),
	confirmPassword: z.string(),
}).refine((values) => values.password === values.confirmPassword, {
	message: "Mật khẩu xác nhận không khớp",
	path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

	function onSubmit({ name, email, password }: RegisterForm) {
		saveRegisteredAccount({ name, email, password });
		navigate("/login", { replace: true, state: { registered: true } });
	}

	return (
		<div className="min-h-screen bg-white px-4 py-5 sm:bg-slate-50 sm:px-6 sm:py-10">
			<section className="mx-auto w-full max-w-[440px] sm:rounded-2xl sm:border sm:border-slate-200 sm:bg-white sm:px-10 sm:py-8 sm:shadow-sm">
				<div className="text-center"><img className="mx-auto h-14 w-14 object-contain" src={logo} alt="LocalHub" /><h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900">Local<span className="text-blue-600">-Hub</span></h1></div>
				<div className="mt-10 text-center"><h2 className="text-2xl font-black text-slate-900">Tạo tài khoản</h2><p className="mt-2 text-xs leading-5 text-slate-500">Đăng ký để bắt đầu sử dụng dịch vụ Local-Hub.</p></div>
				<form className="mt-6 space-y-3" onSubmit={handleSubmit(onSubmit)} noValidate>
					<div><label className="sr-only" htmlFor="name">Họ và tên</label><div className="relative"><UserRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input className="h-10 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" id="name" placeholder="Họ và tên" {...register("name")} /></div>{errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}</div>
					<div><label className="sr-only" htmlFor="email">Email</label><div className="relative"><Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input className="h-10 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" id="email" type="email" placeholder="Email" {...register("email")} /></div>{errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}</div>
					<div><label className="sr-only" htmlFor="password">Mật khẩu</label><div className="relative"><LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input className="h-10 w-full rounded-lg border border-slate-200 px-10 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" id="password" type={showPassword ? "text" : "password"} placeholder="Mật khẩu" {...register("password")} /><button aria-label="Hiện hoặc ẩn mật khẩu" className="absolute right-3 top-2.5 text-slate-400" onClick={() => setShowPassword((visible) => !visible)} type="button">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>{errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}</div>
					<div><label className="sr-only" htmlFor="confirmPassword">Xác nhận mật khẩu</label><div className="relative"><LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input className="h-10 w-full rounded-lg border border-slate-200 px-10 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Nhập lại mật khẩu" {...register("confirmPassword")} /><button aria-label="Hiện hoặc ẩn mật khẩu xác nhận" className="absolute right-3 top-2.5 text-slate-400" onClick={() => setShowConfirmPassword((visible) => !visible)} type="button">{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>{errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>}</div>
					<button className="mt-2 h-10 w-full rounded-lg bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-60" disabled={isSubmitting} type="submit">{isSubmitting ? "Đang tạo tài khoản..." : "Đăng ký"}</button>
				</form>
				<p className="mt-6 text-center text-xs text-slate-500">Đã có tài khoản? <Link className="font-bold text-blue-600" to="/login">Đăng nhập</Link></p>
			</section>
		</div>
	);
}