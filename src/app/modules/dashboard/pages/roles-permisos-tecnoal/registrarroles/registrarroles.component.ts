import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { RolesService } from 'src/app/core/services/roles.service';
import { PermissionsService } from 'src/app/core/services/permissions.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-registrarroles',
  templateUrl: './registrarroles.component.html',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatSelectModule],
  styleUrl: './registrarroles.component.scss',
})
export class RegistrarrolesComponent implements OnInit {
  role: any = {};
  permissions: any[] = [];
  selectedPermissions: any[] = [];
  registroError: string | null = null;
  registrorol: boolean = false;

  constructor(
    private rolesService: RolesService,
    private permissionsService: PermissionsService,
    private dialogRef: MatDialogRef<RegistrarrolesComponent>,
  ) {}

  ngOnInit(): void {
    this.loadPermissions();
  }

  loadPermissions() {
    this.permissionsService.obtenerPermisos().subscribe(
      (permissions: any[]) => {
        this.permissions = permissions;
      },
      (error) => {
        console.error('Error al obtener permisos:', error);
      },
    );
  }

  registerRole() {
    // Verificar si el nombre del rol está presente
    if (!this.role.name) {
      this.registroError = 'El nombre del rol es obligatorio.';
      return; // Detener el proceso de registro
    }

    // Asignar los permisos seleccionados al rol antes de enviarlo al backend
    this.role.permissions = this.selectedPermissions.map((permission) => permission.id);

    this.registrorol = true;
    this.rolesService
      .createRole(this.role)
      .subscribe(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Rol creado exitosamente',
          });
          this.dialogRef.close();
        },
        (error) => {
          console.error('Error al crear el rol:', error); // Imprime el error completo en la consola
          this.registroError = error.error.error || 'Error al crear el rol';
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: this.registroError as string,
          });
        },
      )
      .add(() => {
        this.registrorol = false;
      });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
