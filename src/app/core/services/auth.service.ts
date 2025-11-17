import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../enviroments/enviroment';
import { StorageService } from './storage.service';
import { LoginRequest, RegisterRequest, ApiLoginResponse, AuthResponse, UserResponse, RoleType } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`;

  // Signals para ESTADO COMPARTIDO
  private _currentUser = signal<UserResponse | null>(null);
  private _isAuthenticated = signal<boolean>(false);
  private _token = signal<string | null>(null);

  currentUser = this._currentUser.asReadonly();
  isAuthenticated = this._isAuthenticated.asReadonly();
  token = this._token.asReadonly();

  constructor() {
    this.loadAuthData();
  }

  // POST - Login
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        console.log("LOGIN RAW RESPONSE:", response);
        this.saveAuthData(response.data);  // <--- IMPORTANTE
      })
    );
  }

  // POST - Register
  register(data: RegisterRequest): Observable<ApiLoginResponse> {
    return this.http.post<ApiLoginResponse>(`${this.apiUrl}/registro`, data).pipe(
      tap(response => {
        // Extraer el data de la respuesta envuelta
        this.saveAuthData(response.data);
      })
    );
  }

  // Logout
  logout(): void {
    this.storage.removeItem('token');
    this.storage.removeItem('user');
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
    this._token.set(null);
    this.router.navigate(['/login']);
  }

  // Helpers privados
  private saveAuthData(data: any): void {
    this.storage.setItem('token', data.token);
    this._token.set(data.token);

    const user: UserResponse = {
      id: data.userId,
      email: data.email,
      nombre: data.nombre,
      apellido: data.apellido,
      role: data.role,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('👤 Usuario guardado:', JSON.stringify(user, null, 2));
    
    this.storage.setItem('user', user);
    this._currentUser.set(user);
    this._isAuthenticated.set(true);
    
    console.log('🔑 Es admin?:', this.isAdmin());
  }

  private loadAuthData(): void {
    const token = this.storage.getItem<string>('token');
    const user = this.storage.getItem<UserResponse>('user');

    if (token && user) {
      this._token.set(token);
      this._currentUser.set(user);
      this._isAuthenticated.set(true);
    }
  }

  // Getters para guards
  isAdmin(): boolean {
    const user = this._currentUser();
    // id_rol = 2 es Admin
    return user?.role === RoleType.ROLE_ADMIN;
  }

  isUser(): boolean {
    const user = this._currentUser();
    // id_rol = 1 es Usuario normal
    return user?.role === RoleType.ROLE_USER;
  }

  getToken(): string | null {
    return this._token();
  }

  get currentUserValue(): UserResponse | null {
    return this._currentUser();
  }
}