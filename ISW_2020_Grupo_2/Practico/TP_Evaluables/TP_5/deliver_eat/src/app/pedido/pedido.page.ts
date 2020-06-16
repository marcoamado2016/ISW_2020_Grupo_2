import {Component, OnInit} from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import {EntregaComponent} from '../modals/entrega/entrega.component';
import {FormBuilder, FormGroup} from '@angular/forms';
import {debug} from 'util';
import {Router} from '@angular/router';

@Component({
    selector: 'app-pedido',
    templateUrl: './pedido.page.html',
    styleUrls: ['./pedido.page.scss'],
})
export class PedidoPage implements OnInit {
    public form: FormGroup;
    public productos = [{
        nombre: 'Papas fritas',
        src: 'papas.jpg'
    }, {
        nombre: 'Hamburguesa',
        src: 'hamburguesa.jpg'
    }];
    public direccion: any;

    constructor(public modalController: ModalController,
                public alertController: AlertController,
                private router: Router,
                private fb: FormBuilder) {

    }

    ngOnInit() {
        this.form = this.fb.group({
            monto: [''],
            nombreApellido: [''],
            numeroTarjeta: [''],
            codigoSeg: [''],
            vencimiento: [''],
            formaPago: [''],
            fechaEntregaSegment: ['now'],
            fechaEntrega: [''],
            horaEntrega: [''],
        });
    }

    async entregaModal() {
        const modal = await this.modalController.create({
            component: EntregaComponent,
            componentProps: {
                direccion: this.direccion
            }
        });

        await modal.present();
        const {data} = await modal.onWillDismiss();
        this.direccion = data;
    }

    confirm() {
        const arrayError = this.validateMessages();
        if (arrayError.length) {
            this.alertError(arrayError);
        } else {
            this.router.navigate(['success']);
        }
    }

    validateMessages() {
        const messages = [];
        const formValue = this.form.value;
        if (!this.productos.length) {
            messages.push('Debe incluir al menos un producto');
        }
        if (!this.direccion) {
            messages.push('Debe agregar una dirección de entrega');
        }
        if (!formValue.formaPago) {
            messages.push('Debe elegir una forma de pago');
        }
        if (formValue.formaPago === 'efectivo' && !formValue.monto) {
            messages.push('Cargar el monto de pago');
        }
        if (formValue.formaPago === 'tarjeta') {
            const regex = /^(\d\s?){15,16}$/;
            if (!regex.test(formValue.numeroTarjeta)) {
                messages.push('Número de tarjeta inválido');
            }
            if (!formValue.numeroTarjeta.toString().startsWith('5')) {
                messages.push('Debe ingresar una tarjeta VISA');
            }
            if (!formValue.nombreApellido) {
                messages.push('Cargar el titular de la tarjeta');
            }
            if (!formValue.numeroTarjeta) {
                messages.push('Cargar el número de la tarjeta');
            }
            if (!formValue.vencimiento) {
                messages.push('Cargar el vencimiento de la tarjeta');
            }
            if (formValue.codigoSeg && formValue.codigoSeg.toString().split('').length > 3) {
                messages.push('El código de seguridad debe tener 3 dígitos');
            }
            if (!formValue.codigoSeg) {
                messages.push('Cargar el código de seguridad de la tarjeta');
            }
        }
        if (formValue.fechaEntregaSegment !== 'now') {
            if (!formValue.fechaEntrega) {
                messages.push('Agregar la fecha de entrega.');
            }
            if (!formValue.horaEntrega) {
                messages.push('Agregar la hora de entrega.');
            }
        }
        return messages;
    }

    async alertError(messages) {
        let itemsList = ``;
        messages.map((item) => {
            itemsList += `<li>${item}</li>`;
        });
        const message = `<ul style="padding: 1rem;">${itemsList}</ul>`;
        const alert = await this.alertController.create({
            header: 'Atención!',
            message,
            buttons: ['Aceptar']
        });
        await alert.present();
    }
}
