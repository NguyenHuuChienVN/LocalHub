import { zodResolver } from "@hookform/resolvers/zod";
import {
	ArrowLeft,
	Camera,
	Check,
	ContactRound,
	CircleHelp,
	ImagePlus,
	LockKeyhole,
	Mars,
	MapPin,
	NotebookPen,
	Save,
	ShieldAlert,
	Trash2,
	UserRound,
	Venus,
	X,
	type LucideIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router";
import { z } from "zod";
import { removeProfileAvatar, updateProfile, uploadProfileAvatar } from "../../api/services/profile";
import { clearAuthUser, getAuthUser, updateAuthUser, type AuthUser } from "../../features/auth/authStorage";
import { useProfileAvatar } from "../../hooks/useProfileAvatar";
import DeactivateAccountDialog from "./DeactivateAccountDialog";
import ProfileSecurityDialog from "./ProfileSecurityDialog";

const today = new Date();
const maxBirthDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

const profileSchema = z.object({
	name: z.string().trim().min(1, "Vui lòng nhập họ tên").max(100, "Họ tên tối đa 100 ký tự"),
	phone: z.string().trim().refine((value) => !value || /^\+?\d{7,15}$/.test(value), "Số điện thoại không hợp lệ"),
	birthDate: z.string().refine((value) => {
		if (!value) return true;
		if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value > maxBirthDate) return false;
		const parsedDate = new Date(`${value}T00:00:00Z`);
		return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === value;
	}, "Ngày sinh không hợp lệ"),
	gender: z.enum(["", "male", "female", "other"]),
	city: z.string().trim().max(100, "Tối đa 100 ký tự"),
	district: z.string().trim().max(100, "Tối đa 100 ký tự"),
	address: z.string().trim().max(250, "Tối đa 250 ký tự"),
	bio: z.string().trim().max(200, "Giới thiệu tối đa 200 ký tự"),
});

type ProfileForm = z.infer<typeof profileSchema>;
const genders: Array<{ value: Exclude<ProfileForm["gender"], "">; label: string; icon: LucideIcon }> = [
	{ value: "male", label: "Nam", icon: Mars },
	{ value: "female", label: "Nữ", icon: Venus },
	{ value: "other", label: "Khác", icon: CircleHelp },
];

const inputClass = "mt-1 h-9 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-normal text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:px-3 sm:text-sm";

export default function EditProfilePage() {
	const user = getAuthUser();
	if (!user) return <Navigate replace to="/login" />;
	return <EditProfileForm user={user} />;
}

function EditProfileForm({ user }: { user: AuthUser }) {
	const navigate = useNavigate();
	const avatarInputRef = useRef<HTMLInputElement>(null);
	const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl ?? null);
	const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
	const [isRemovingAvatar, setIsRemovingAvatar] = useState(false);
	const [avatarError, setAvatarError] = useState("");
	const [avatarNotice, setAvatarNotice] = useState("");
	const [isAvatarPreviewOpen, setIsAvatarPreviewOpen] = useState(false);
	const [submitError, setSubmitError] = useState("");
	const [isSecurityOpen, setIsSecurityOpen] = useState(false);
	const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors, isDirty, isSubmitting },
	} = useForm<ProfileForm>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			name: user.name,
			phone: user.phone ?? "",
			birthDate: user.birthDate ?? "",
			gender: user.gender ?? "",
			city: user.city ?? "",
			district: user.district ?? "",
			address: user.address ?? "",
			bio: user.bio ?? "",
		},
	});

	async function onSubmit(values: ProfileForm) {
		setSubmitError("");
		if (!user.token) {
			setSubmitError("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.");
			return;
		}

		try {
			const updatedUser = await updateProfile(user.token, {
				...values,
				phone: values.phone || null,
				birthDate: values.birthDate || null,
				gender: values.gender || null,
				city: values.city || null,
				district: values.district || null,
				address: values.address || null,
				bio: values.bio || null,
			});
			updateAuthUser(updatedUser);
			navigate("/profile", { replace: true, state: { profileUpdated: true } });
		} catch (error) {
			setSubmitError(error instanceof Error ? error.message : "Không thể lưu hồ sơ. Vui lòng thử lại.");
		}
	}

	async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		event.target.value = "";
		setAvatarError("");
		if (!file) return;

		if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
			setAvatarError("Vui lòng chọn ảnh JPEG, PNG hoặc WebP.");
			return;
		}
		if (file.size > 2 * 1024 * 1024) {
			setAvatarError("Ảnh đại diện không được vượt quá 2 MB.");
			return;
		}
		if (!user.token) {
			setAvatarError("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.");
			return;
		}

		setIsUploadingAvatar(true);
		try {
			const image = await new Promise<string>((resolve, reject) => {
				const reader = new FileReader();
				reader.addEventListener("load", () => {
					if (typeof reader.result === "string") resolve(reader.result);
					else reject(new Error("Không thể đọc ảnh đã chọn."));
				});
				reader.addEventListener("error", () => reject(new Error("Không thể đọc ảnh đã chọn.")));
				reader.readAsDataURL(file);
			});
			const uploadedUrl = await uploadProfileAvatar(user.token, image);
			setAvatarUrl(uploadedUrl);
			updateAuthUser({ avatarUrl: uploadedUrl });
			setAvatarNotice("Ảnh đại diện đã được cập nhật.");
		} catch (error) {
			setAvatarError(error instanceof Error ? error.message : "Không thể tải ảnh đại diện.");
		} finally {
			setIsUploadingAvatar(false);
		}
	}

	async function handleRemoveAvatar() {
		if (!avatarUrl || !user.token || !window.confirm("Bạn có chắc muốn xóa ảnh đại diện?")) return;
		setAvatarError("");
		setIsRemovingAvatar(true);
		try {
			await removeProfileAvatar(user.token);
			setAvatarUrl(null);
			updateAuthUser({ avatarUrl: null });
			setAvatarNotice("Đã xóa ảnh đại diện.");
		} catch (error) {
			setAvatarError(error instanceof Error ? error.message : "Không thể xóa ảnh đại diện.");
		} finally {
			setIsRemovingAvatar(false);
		}
	}

	function finishDeactivation() {
		clearAuthUser();
		setIsDeactivateOpen(false);
		navigate("/", { replace: true });
	}

	const initials = user.name.trim().slice(0, 2).toUpperCase() || "LH";
	const avatarPreview = useProfileAvatar(avatarUrl, user.token);
	const resolvedAvatar = avatarPreview.src;
	const bioLength = watch("bio").length;
	return (
		<main className="relative min-h-[calc(100vh-136px)] overflow-hidden bg-[#f2f7ff] px-3 py-5 text-slate-900 sm:px-6 sm:py-8">
			<div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-32 h-72 w-72 rounded-full bg-blue-100/70 blur-3xl" />
			<section className="relative mx-auto max-w-3xl">
				<Link className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition hover:text-blue-700" replace to="/profile">
					<ArrowLeft className="h-3.5 w-3.5" /> Hồ sơ của tôi
				</Link>

				<header className="mt-4 flex items-center gap-3">
					<button aria-label="Xem ảnh đại diện" className="relative flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-blue-950 text-sm font-bold text-blue-200 outline-none transition hover:ring-2 hover:ring-blue-400 hover:ring-offset-2 focus-visible:ring-2 focus-visible:ring-blue-500" onClick={() => setIsAvatarPreviewOpen(true)} type="button">
						{resolvedAvatar ? <img alt="" className="h-full w-full object-cover" src={resolvedAvatar} /> : initials}
					</button>
					<div className="min-w-0">
						<div className="flex flex-wrap items-center gap-2">
							<h1 className="text-xl font-black tracking-tight sm:text-2xl">Chỉnh sửa hồ sơ</h1>
							<span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700"><Check className="h-3 w-3" /> Đang hoạt động</span>
						</div>
						<p className="mt-0.5 text-xs text-slate-500">Cập nhật thông tin tài khoản</p>
					</div>
				</header>

				<form className="mt-4 overflow-hidden rounded-xl border border-slate-200/80 bg-white/95 shadow-[0_8px_24px_rgba(30,64,175,0.07)] backdrop-blur-sm" onSubmit={handleSubmit(onSubmit)} noValidate>
					<div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-3 py-3 sm:px-5">
						<button aria-label="Xem ảnh đại diện" className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-blue-950 text-sm font-bold text-blue-200 outline-none transition hover:ring-2 hover:ring-blue-400 hover:ring-offset-2 focus-visible:ring-2 focus-visible:ring-blue-500" onClick={() => setIsAvatarPreviewOpen(true)} type="button">
							{resolvedAvatar ? <img alt={`Ảnh đại diện của ${user.name}`} className="h-full w-full object-cover" src={resolvedAvatar} /> : initials}
						</button>
						<div className="min-w-0 flex-1">
							<p className="text-xs font-bold text-slate-800">Ảnh đại diện</p>
							<p className="mt-0.5 text-[11px] text-slate-500">JPG, PNG hoặc WebP, tối đa 2 MB.</p>
						</div>
						<input accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarChange} ref={avatarInputRef} type="file" />
						<button className="inline-flex h-8 items-center gap-1.5 rounded-md border cursor-pointer border-slate-300 px-2.5 text-xs font-bold text-blue-700 hover:bg-slate-50 disabled:opacity-50" disabled={isUploadingAvatar || isRemovingAvatar} onClick={() => avatarInputRef.current?.click()} type="button">
							{isUploadingAvatar ? <ImagePlus className="h-3.5 w-3.5 animate-pulse" /> : <Camera className="h-3.5 w-3.5" />}
							{isUploadingAvatar ? "Đang tải..." : "Tải ảnh lên"}
						</button>
						{avatarUrl && <button className="inline-flex h-8 cursor-pointer items-center gap-1 px-2 text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-50" disabled={isUploadingAvatar || isRemovingAvatar} onClick={handleRemoveAvatar} type="button"><Trash2 className="h-3.5 w-3.5" />{isRemovingAvatar ? "Đang xóa..." : "Xóa ảnh"}</button>}
						{avatarError && <p className="w-full text-xs text-red-600" role="alert">{avatarError}</p>}
						{avatarPreview.error && <p className="w-full text-xs text-red-600" role="alert">{avatarPreview.error}</p>}
						{avatarNotice && <p className="w-full text-xs text-emerald-700" role="status">{avatarNotice}</p>}
					</div>

					<div className="space-y-4 p-3 sm:space-y-5 sm:p-5">
						<section>
							<h2 className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wide text-slate-700 sm:text-[11px]"><UserRound className="h-3.5 w-3.5 text-blue-600" /> Thông tin cá nhân</h2>
							<div className="grid grid-cols-2 gap-2 sm:gap-3">
								<label className="block text-xs font-semibold text-slate-700">Họ và tên <span className="text-red-600">*</span>
									<input autoComplete="name" className={inputClass} maxLength={100} {...register("name")} />
									{errors.name && <span className="mt-1 block text-[11px] font-normal text-red-600">{errors.name.message}</span>}
								</label>
								<label className="block text-xs font-semibold text-slate-700">Ngày sinh
									<input autoComplete="bday" className={inputClass} max={maxBirthDate} {...register("birthDate")} type="date" />
									{errors.birthDate && <span className="mt-1 block text-[11px] font-normal text-red-600">{errors.birthDate.message}</span>}
								</label>
							</div>
							<fieldset className="mt-2">
								<legend className="text-[11px] font-semibold text-slate-700 sm:text-xs">Giới tính</legend>
								<div className="mt-1 flex flex-wrap gap-1.5" role="radiogroup" aria-label="Giới tính">
									{genders.map(({ value, label, icon: GenderIcon }) => {
										const selected = watch("gender") === value;
										return <button aria-checked={selected} className={`inline-flex min-w-14 items-center justify-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-semibold transition sm:px-3 sm:py-1.5 sm:text-xs ${selected ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-100" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`} key={value} onClick={() => setValue("gender", value, { shouldDirty: true, shouldValidate: true })} role="radio" type="button"><GenderIcon aria-hidden="true" className="h-3 w-3" />{label}</button>;
									})}
									{(["male", "female", "other"] as const).map((value) => <input className="sr-only" key={value} type="radio" value={value} {...register("gender")} />)}
								</div>
							</fieldset>
						</section>

						<section>
							<h2 className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wide text-slate-700 sm:text-[11px]"><ContactRound className="h-3.5 w-3.5 text-blue-600" /> Thông tin liên hệ</h2>
							<div className="grid grid-cols-2 gap-2 sm:gap-3">
								<label className="block text-xs font-semibold text-slate-700">Email
									<input autoComplete="email" className={`${inputClass} cursor-not-allowed border-slate-200 bg-slate-50 text-slate-500`} readOnly value={user.email} />
									<span className="mt-1 block text-[9px] font-normal text-slate-400 sm:text-[10px]">Email không thể thay đổi.</span>
								</label>
								<label className="block text-xs font-semibold text-slate-700">Số điện thoại
									<input autoComplete="tel" className={inputClass} inputMode="tel" placeholder="Ví dụ: 0912345678" type="tel" {...register("phone")} />
									{errors.phone && <span className="mt-1 block text-[11px] font-normal text-red-600">{errors.phone.message}</span>}
								</label>
							</div>
						</section>

						<section>
							<h2 className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wide text-slate-700 sm:text-[11px]"><MapPin className="h-3.5 w-3.5 text-blue-600" /> Địa chỉ</h2>
							<div className="grid grid-cols-2 gap-2 sm:gap-3">
								<label className="block text-xs font-semibold text-slate-700">Tỉnh / Thành phố
									<input autoComplete="address-level1" className={inputClass} list="profile-cities" maxLength={100} placeholder="Ví dụ: Bắc Ninh" {...register("city")} />
									<datalist id="profile-cities"><option value="Hà Nội" /><option value="Hồ Chí Minh" /><option value="Đà Nẵng" /><option value="Bắc Ninh" /><option value="Cần Thơ" /><option value="Hải Phòng" /><option value="Huế" /></datalist>
									{errors.city && <span className="mt-1 block text-[11px] font-normal text-red-600">{errors.city.message}</span>}
								</label>
								<label className="block text-xs font-semibold text-slate-700">Quận / Huyện / Phường / Xã
									<input autoComplete="address-level2" className={inputClass} maxLength={100} placeholder="Nhập quận, huyện, phường hoặc xã" {...register("district")} />
									{errors.district && <span className="mt-1 block text-[11px] font-normal text-red-600">{errors.district.message}</span>}
								</label>
							</div>
							<label className="mt-2 block text-[11px] font-semibold text-slate-700 sm:text-xs">Địa chỉ chi tiết
								<input autoComplete="street-address" className={inputClass} maxLength={250} placeholder="Số nhà, tên đường, phường / xã" {...register("address")} />
								{errors.address && <span className="mt-1 block text-[11px] font-normal text-red-600">{errors.address.message}</span>}
							</label>
						</section>

						<section>
							<h2 className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wide text-slate-700 sm:text-[11px]"><NotebookPen className="h-3.5 w-3.5 text-blue-600" /> Giới thiệu</h2>
							<label className="block text-[11px] font-semibold text-slate-700 sm:text-xs">Giới thiệu bản thân
								<textarea className="mt-1 min-h-16 w-full resize-y rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-normal text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:min-h-20 sm:px-3 sm:text-sm" maxLength={200} placeholder="Viết vài dòng về bạn..." {...register("bio")} />
								<span className="mt-0.5 flex justify-end text-[9px] font-normal text-slate-400 sm:text-[10px]">{bioLength}/200</span>
								{errors.bio && <span className="mt-1 block text-[11px] font-normal text-red-600">{errors.bio.message}</span>}
							</label>
						</section>
					</div>

					<footer className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-3 py-2.5 sm:px-5">
						<p className={`flex items-center gap-1.5 text-[9px] sm:text-[10px] ${isDirty ? "text-amber-700" : "text-slate-400"}`} role="status">
							<span className={`h-1.5 w-1.5 rounded-full ${isDirty ? "bg-amber-500" : "bg-slate-300"}`} />
							{isDirty ? "Có thay đổi chưa lưu" : "Thông tin đã được lưu"}
						</p>
						<div className="flex gap-2">
							<Link className="inline-flex h-8 items-center rounded-md border border-slate-200 px-3 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 sm:h-9 sm:text-xs" replace to="/profile">Hủy</Link>
							<button className="inline-flex h-8 items-center gap-1.5 rounded-md bg-blue-600 px-3 text-[11px] font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:h-9 sm:text-xs" disabled={!isDirty || isSubmitting} type="submit">
								<Save className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
							</button>
						</div>
					</footer>
					{submitError && <p className="border-t border-red-100 bg-red-50 px-4 py-2 text-xs text-red-700" role="alert">{submitError}</p>}
				</form>

				<section className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200/80 bg-white/95 p-4 shadow-[0_8px_24px_rgba(30,64,175,0.05)]">
					<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><LockKeyhole className="h-4 w-4" /></div>
					<div className="min-w-0 flex-1"><h2 className="text-xs font-bold text-slate-800">Bảo mật</h2><p className="mt-0.5 text-[10px] text-slate-500">Đổi mật khẩu để bảo vệ tài khoản của bạn.</p></div>
					<button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-300 px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50" onClick={() => setIsSecurityOpen(true)} type="button"><LockKeyhole className="h-3.5 w-3.5" /> Quản lý bảo mật</button>
				</section>

				<section className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-red-200 bg-white/95 p-4 shadow-[0_8px_24px_rgba(30,64,175,0.05)]">
					<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600"><ShieldAlert className="h-4 w-4" /></div>
					<div className="min-w-0 flex-1"><h2 className="text-xs font-bold text-red-700">Khu vực nguy hiểm</h2><p className="mt-0.5 text-[10px] text-slate-500">Vô hiệu hóa tài khoản và đăng xuất khỏi LocalHub.</p></div>
					<button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-red-300 px-2.5 text-xs font-semibold text-red-700 hover:bg-red-50" onClick={() => setIsDeactivateOpen(true)} type="button"><Trash2 className="h-3.5 w-3.5" /> Vô hiệu hóa</button>
				</section>
			</section>

			{isSecurityOpen && user.token && <ProfileSecurityDialog onClose={() => setIsSecurityOpen(false)} token={user.token} />}
			{isDeactivateOpen && user.token && <DeactivateAccountDialog onCancel={() => setIsDeactivateOpen(false)} onDeactivated={finishDeactivation} token={user.token} />}
			{isAvatarPreviewOpen && (
				<div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsAvatarPreviewOpen(false); }} role="presentation">
					<section aria-label="Ảnh đại diện" aria-modal="true" className="relative flex max-h-[90vh] max-w-[90vw] items-center justify-center rounded-2xl bg-white p-2 shadow-2xl" role="dialog">
						<button aria-label="Đóng ảnh đại diện" className="absolute -right-3 -top-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-slate-700 shadow-lg transition hover:bg-slate-100" onClick={() => setIsAvatarPreviewOpen(false)} type="button"><X className="h-5 w-5" /></button>
						{resolvedAvatar
							? <img alt={`Ảnh đại diện của ${user.name}`} className="max-h-[85vh] max-w-[85vw] rounded-xl object-contain" src={resolvedAvatar} />
							: <div className="flex h-56 w-56 items-center justify-center rounded-full bg-blue-950 text-5xl font-bold text-blue-200">{initials}</div>}
					</section>
				</div>
			)}
		</main>
	);
}
