import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { HomeModule } from './features/home/home.module';
import { AboutModule } from './features/about/about.module';
import { ServicesModule } from './features/services/services.module';
import { PortfolioModule } from './features/portfolio/portfolio.module';
import { ClientsModule } from './features/clients/clients.module';
import { ContactModule } from './features/contact/contact.module';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiInterceptor } from './core/interceptors/api.interceptor';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { ToastComponent } from './shared/toast/toast.component';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    HomeModule,
    AboutModule,
    ServicesModule,
    PortfolioModule,
    ClientsModule,
    ContactModule,
    ToastComponent
  ],
providers: [
    provideHttpClient(
  withInterceptors([apiInterceptor]),
),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
