import { AuthService } from './auth.service';

describe('AuthService', () => {
  it('should generate a two-factor secret and QR data', async () => {
    const service = new AuthService(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );

    const result = await service.generateTwoFactorSecret('admin@petspa.com');

    expect(result.secret).toBeTruthy();
    expect(result.otpauthUrl).toContain('otpauth://totp');
    expect(result.qrCodeDataUrl).toContain('data:image/png;base64,');
  });
});
