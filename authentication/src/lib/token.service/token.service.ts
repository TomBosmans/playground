export default interface TokenService {
  generateToken(): string
  hashToken(token: string): string
}
