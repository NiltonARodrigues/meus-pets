import { OwnersService } from './../shared/services/owners.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PoBreadcrumb, PoDialogService, PoNotificationService, PoPageEditLiterals } from '@po-ui/ng-components';
import { OwnerForm } from '../shared/interface/owner-form';
import { Owner } from '../shared/interface/owner.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-owners-form',
  templateUrl: './owners-form.component.html',
  styleUrls: ['./owners-form.component.css']
})
export class OwnersFormComponent {
  ownersForm!: FormGroup;
  breadcrumb: PoBreadcrumb = {
    items: [
      { label: 'Home', link: '/' },
      { label: 'Tutores', link: '/owners' },
      { label: 'Novo registro' }
    ]
  }

  isLoading: boolean = false;
  isDisabledButton: boolean = false;
  ownersSubscription!: Subscription;
  operation: string = 'post';
  title: string = 'Novo registro';
  customLiterals: PoPageEditLiterals = {
    saveNew: 'Confirmar e criar um novo'
  };

  //- objeto com os dados vazios do owner
  owner: Owner = {
    id: '',
    name: '',
    rg: '',
    cpf: '',
    email: '',
    tel1: '',
    tel2: ''
  };


  constructor(private router: Router,
    private ownersService: OwnersService,
    private poNotificationService: PoNotificationService,
    private activatedRoute: ActivatedRoute,
    private poDialogService: PoDialogService
  ) { };

  ngOnInit(): void {
    this.setOperation();
    this.setTitle();
    this.operation === 'post' ? this.createForm(this.owner) : this.getOwner();

    // this.ownersForm.valueChanges.subscribe({
    //   next: (res) => console.log(res)
    // })
  };

  createForm(owner: Owner): void {
    this.ownersForm = new FormGroup<OwnerForm>({
      id: new FormControl(owner.id, { nonNullable: true }),
      name: new FormControl(owner.name, { nonNullable: true }),
      rg: new FormControl(owner.rg, { nonNullable: true }),
      cpf: new FormControl(owner.cpf, { nonNullable: true }),
      email: new FormControl(owner.email, { nonNullable: true }),
      tel1: new FormControl(owner.tel1, { nonNullable: true }),
      tel2: new FormControl(owner.tel2, { nonNullable: true })
    })

  };

  cancel(): void {
    this.ownersSubscription.unsubscribe();
    this.router.navigate(['owners']);
  };

  save(isSaveAndNew: boolean): void {
    this.isDisabledButton = true;
    this.isLoading = true;
    this.operation === 'post' ? this.post(isSaveAndNew) : this.put(isSaveAndNew);
  };

  onSaveSucess(response: Owner, isSaveAndNew: boolean): void {
    this.isLoading = false;
    this.isDisabledButton = true;
    isSaveAndNew ? this.ownersForm.reset() : this.router.navigate(['owners']);
    this.poNotificationService.success(`Registro incluído com sucesso: ${response.id}`)
  };

  onSaveError(error: any): void {
    this.isLoading = false;
    this.isDisabledButton = false;
    this.poNotificationService.error('Erro ao salvar o registro');
  };

  setOperation(): void {
    this.operation = this.activatedRoute.snapshot.params['id'] ? 'put' : 'post'
  };

  setTitle(): void {
    if (this.operation === 'put') {
      this.title = 'Alterar registro';
      this.customLiterals.saveNew = 'Excluir'
    } else {
      this.title = 'Novo registro';
    };
    this.breadcrumb.items[2].label = this.title;
  };

  getOwner(): void {
    this.isLoading = true;
    this.ownersService.getById(this.activatedRoute.snapshot.params['id']).subscribe({
      next: (owner: Owner) => this.onGetSucess(owner),
      error: (error: any) => this.onGetError(error)
    })
  };

  onGetSucess(owner: Owner): void {
    this.isLoading = false;
    this.owner = owner;
    this.createForm(owner);
  };

  onGetError(error: any): void {
    this.isLoading = false;
    this.poNotificationService.error('Falha ao retornar o registro');
  };

  post(isSaveAndNew: boolean): void {
    this.ownersSubscription = this.ownersService.post(this.ownersForm.value).subscribe({
      next: response => this.onSaveSucess(response, isSaveAndNew),
      error: error => this.onSaveError(error)
    });

  };

  put(isSaveAndNew: boolean): void {
    this.ownersSubscription = this.ownersService.put(this.ownersForm.value).subscribe({
      next: response => this.onSaveSucess(response, isSaveAndNew),
      error: error => this.onSaveError(error)
    });

  };

  saveOrDelete(): void {
    if (this.operation === 'post') {
      this.save(true);
    } else {
      this.confirmDelete();
    }
  };

  confirmDelete(): void {
    this.poDialogService.confirm({
      title: 'Excluir tutor',
      message: 'Tem certeza que deseja continuar com a exclusão?',
      confirm: this.delete.bind(this)
    });
  }

  delete():void{
    this.isLoading = true;
    this.isDisabledButton=true;
    this.ownersService.delete(this.activatedRoute.snapshot.params['id']).subscribe({
      next: () => this.onDeleteSucess(),
      error: () => this.onDeleteError()
    });
  };

  onDeleteSucess():void{
    this.router.navigate(['owners']);
    this.poNotificationService.success('Registro excluído com sucesso');
  }

  onDeleteError():void{
    this.isLoading = false;
    this.isDisabledButton = false;
    this.poNotificationService.error('Erro ao excluir registro');
  }
}
