import { useEffect, useState } from "react";
import { fetchProfileAvatar } from "../api/services/profile";

type ProfileAvatarState = {
	src: string | null;
	error: string;
};

export function useProfileAvatar(avatarUrl: string | null | undefined, token: string | null | undefined): ProfileAvatarState {
	const [state, setState] = useState<ProfileAvatarState>({ src: null, error: "" });

	useEffect(() => {
		if (!avatarUrl) {
			setState({ src: null, error: "" });
			return;
		}

		if (/^https?:\/\//i.test(avatarUrl)) {
			setState({ src: avatarUrl, error: "" });
			return;
		}

		if (!token) {
			setState({ src: null, error: "Vui lòng đăng nhập lại để xem ảnh đại diện." });
			return;
		}

		let cancelled = false;
		let objectUrl: string | null = null;
		setState({ src: null, error: "" });

		void fetchProfileAvatar(token)
			.then((image) => {
				if (cancelled) return;
				objectUrl = URL.createObjectURL(image);
				setState({ src: objectUrl, error: "" });
			})
			.catch((error: unknown) => {
				if (!cancelled) {
					setState({
						src: null,
						error: error instanceof Error ? error.message : "Không thể tải ảnh đại diện.",
					});
				}
			});

		return () => {
			cancelled = true;
			if (objectUrl) URL.revokeObjectURL(objectUrl);
		};
	}, [avatarUrl, token]);

	return state;
}
