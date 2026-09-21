import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LogIn, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { z } from "zod";
import logo from "../../../assets/images/logo-nha.png";
import { getRegisteredAccount, saveAuthUser } from "../../../features/auth/authStorage";

const loginSchema = z.object({
	email: z.string().trim().email("Email không hợp lệ"),
	password: z.string().min(6, "Mật khẩu cần có ít nhất 6 ký tự"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const [showPassword, setShowPassword] = useState(false);
	const [submitError, setSubmitError] = useState("");
	const [rememberMe, setRememberMe] = useState(true);
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: "", password: "" },
	});

	function onSubmit({ email, password }: LoginForm) {
		setSubmitError("");

		const registeredAccount = getRegisteredAccount();
		const isDemoAccount = email === "demo@localhub.vn" && password === "123456";
		const isRegisteredAccount = registeredAccount?.email === email && registeredAccount.password === password;

		if (!isDemoAccount && !isRegisteredAccount) {
			setSubmitError("Thông tin đăng nhập chưa đúng. Dùng demo@localhub.vn / 123456 để thử nghiệm.");
			return;
		}

		saveAuthUser({ email, name: isRegisteredAccount ? registeredAccount?.name ?? "Khách hàng LocalHub" : "Khách hàng LocalHub" });
		const destination = (location.state as { from?: string } | null)?.from ?? "/";
		navigate(destination, { replace: true });
	}

	return (
		<div className="min-h-screen bg-white px-4 py-5 sm:bg-slate-50 sm:px-6 sm:py-10">
			<section className="mx-auto w-full max-w-[440px] sm:rounded-2xl sm:border sm:border-slate-200 sm:bg-white sm:px-10 sm:py-8 sm:shadow-sm">
				<div className="text-center">
					<img className="mx-auto h-14 w-14 object-contain" src={logo} alt="LocalHub" />
					<h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900">Local<span className="text-blue-600">-Hub</span></h1>
				</div>
				<div className="mt-10 text-center sm:mt-12">
					<h2 className="text-2xl font-black text-slate-900">Đăng nhập</h2>
					<p className="mt-2 text-xs leading-5 text-slate-500">Chào mừng bạn trở lại! Vui lòng đăng nhập<br className="sm:hidden" /> để tiếp tục sử dụng Local-Hub.</p>
				</div>

				<form className="mt-6 space-y-3" onSubmit={handleSubmit(onSubmit)} noValidate>
					<div>
						<label className="sr-only" htmlFor="email">Email hoặc số điện thoại</label>
						<div className="relative"><Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input className="h-10 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-xs outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" id="email" type="email" placeholder="Email hoặc số điện thoại" {...register("email")} /></div>
						{errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
					</div>
					<div>
						<label className="sr-only" htmlFor="password">Mật khẩu</label>
						<div className="relative"><LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input className="h-10 w-full rounded-lg border border-slate-200 px-10 text-xs outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" id="password" type={showPassword ? "text" : "password"} placeholder="Mật khẩu" {...register("password")} /><button aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} className="absolute right-3 top-2.5 text-slate-400" onClick={() => setShowPassword((visible) => !visible)} type="button">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
						{errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
					</div>
					<div className="flex items-center justify-between pt-1 text-[11px]">
						<label className="flex items-center gap-2 text-slate-600"><input className="h-3 w-3 accent-blue-600" type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} /> Ghi nhớ đăng nhập</label>
						<button className="font-semibold text-blue-600" type="button">Quên mật khẩu?</button>
					</div>
					{submitError && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs leading-5 text-red-700" role="alert">{submitError}</p>}
					<button className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-xs font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting} type="submit"><LogIn className="h-4 w-4" /> {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}</button>
				</form>

				<div className="my-6 flex items-center gap-3 text-[11px] text-slate-400"><span className="h-px flex-1 bg-slate-200" />Hoặc đăng nhập bằng<span className="h-px flex-1 bg-slate-200" /></div>
				<div className="grid grid-cols-2 gap-3"><button className="flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50" type="button"><span className="font-black text-red-500">G</span> Google</button><button className="flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50" type="button"><span className="font-black text-blue-600">f</span> Facebook</button></div>
				<p className="mt-8 text-center text-xs text-slate-500">Chưa có tài khoản? <Link className="font-bold text-blue-600" to="/register">Đăng ký ngay</Link></p>
			</section>
		</div>
	);
}