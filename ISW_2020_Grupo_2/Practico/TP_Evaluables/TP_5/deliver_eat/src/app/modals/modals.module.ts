import {NgModule} from '@angular/core';
import {EntregaComponent} from './entrega/entrega.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule
    ],
    declarations: [EntregaComponent],
    entryComponents: [EntregaComponent]
})
export class ModalsModule {

}
