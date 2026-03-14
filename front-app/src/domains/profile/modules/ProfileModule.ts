// ─── Payload types ────────────────────────────────────────────────────────────

export type UpdateProfilePayload = {
	user_name: string;
	user_description: string;
	photo?: File;
};

export type AddSocialLinkPayload = {
	link: string;
};

// ─── GET /users/:user_id ──────────────────────────────────────────────────────

export function getProfile(userId: number): void {
	console.log('GET /users/:user_id', { userId });
}

// ─── PUT /users/me ────────────────────────────────────────────────────────────

export function updateProfile(payload: UpdateProfilePayload): void {
	console.log('PUT /users/me', payload);
}

// ─── DELETE /users/me ─────────────────────────────────────────────────────────

export function deleteProfile(): void {
	console.log('DELETE /users/me');
}

// ─── POST /users/:user_id/social-links ───────────────────────────────────────

export function addSocialLink(userId: number, payload: AddSocialLinkPayload): void {
	console.log(`POST /users/${userId}/social-links`, payload);
}

// ─── DELETE /users/:user_id/social-links/:social_link_id ─────────────────────

export function deleteSocialLink(userId: number, socialLinkId: number): void {
	console.log(`DELETE /users/${userId}/social-links/${socialLinkId}`);
}
