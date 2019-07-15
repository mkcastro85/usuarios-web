import { Component, OnInit } from '@angular/core';
import { UsersService } from '../shared/users.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { User } from '../shared/user.model';
import { UserDatasource } from '../shared/user-data-source';
import { MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-usuarios-pagina',
  templateUrl: './usuarios-pagina.component.html',
  styleUrls: ['./usuarios-pagina.component.css']
})
export class UsuariosPaginaComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nombres', 'apellidos', 'cedula', 'correo', 'telefono','acciones'];
  users: User[] = [];
  subject = new BehaviorSubject(this.users);
  dataSource = new UserDatasource(this.subject.asObservable());
  registerForm: FormGroup;
  submitted = false;
  user: User;
  userEdit: User;

  constructor(public snackBar: MatSnackBar,private usersService: UsersService,private formBuilder: FormBuilder) { }

  ngOnInit() {
    //iniciamos el formulario con los valores por defecto
    this.initForm();
    //Obtenemos la lista de usuarios
    this.getUsers();

  }

  /**
   * Metodo encargado de iniciar el formulario
   */
  initForm(){
    this.userEdit=null;
    this.registerForm = this.formBuilder.group({
      identification: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      names: ['', Validators.required],
      lastname: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      email: ['', [Validators.required, Validators.email]],
      

    });
    console.log("Ejecutando servicios");
  }

  /*
* Obtenemos listado de usuarios
*/
  getUsers(): void {
    this.usersService.getAll()
      .subscribe(users => {
        this.subject.next(users);
        this.users = users;
      });
  }

  /**
   * Guardar Usuario
   */
  save(): void {
    // Validamos formulario
    if (this.registerForm.invalid) {
      return;
    }
    //Validamos si vamos actualizar o a crear usuario
    if(this.userEdit==null){
      this.usersService.save(this.registerForm.value)
      .subscribe(
      data => {
        this.users.push(data.data);
        this.subject.next(this.users);
        this.messageSnackBar("Usuario guardado con exito");
        this.initForm();
      },
      error => this.messageSnackBar("Error  Guardando Usuario, Usuario duplicado"));
    }else{
      this.usersService.update(this.registerForm.value,this.userEdit.id)
      .subscribe(
      data => {
        console.log(data.data);
        this.userEdit.identification=data.data.identification;
        this.userEdit.names=data.data.names;
        this.userEdit.phone=data.data.phone;
        this.userEdit.email=data.data.email;
        this.userEdit.lastname=data.data.lastname;
        this.initForm();
        this.messageSnackBar("Usuario actualizado con exito");
      },
      error => this.messageSnackBar("Error  actualizando Usuario, Usuario duplicado"));
      
    }
    
    
  }

  /**
   * Editar Usuario
   */
  edit(userEdit: User): void {
    this.registerForm = this.formBuilder.group({
      identification: [userEdit.identification, [Validators.required, Validators.pattern("^[0-9]*$")]],
      names: [userEdit.names, Validators.required],
      lastname: [userEdit.lastname, Validators.required],
      phone: [userEdit.phone, [Validators.required, Validators.pattern("^[0-9]*$")]],
      email: [userEdit.email, [Validators.required, Validators.email]],
    });
    this.userEdit=userEdit;
  }

  /*
  * Metodo encargado de borrar usuarios
  */
 delete(userDelete: User): void {
  this.usersService.delete(userDelete.id)
    .subscribe(
    data => {
      const index: number = this.users.findIndex(item => item.id == userDelete.id);
      if (index !== -1) {
        this.users.splice(index, 1);
        this.subject.next(this.users);
      }
      this.messageSnackBar("Usuario Borrado");
    },
    error => this.messageSnackBar("Error borrando usuario"));
}


  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  /*
  * Metodo encargado de procesar los mensajes del componente
  */
 messageSnackBar(message: string): void {
  this.initForm();
  this.snackBar.open(message, "Aceptar", {
    duration: 6000,
  });
}

}
