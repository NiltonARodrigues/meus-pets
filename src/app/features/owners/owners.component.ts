import { Owners } from './shared/interface/owners.model';
import { Component, OnInit } from '@angular/core';
import { PoBreadcrumb, PoNotification, PoNotificationService, PoPageAction, PoTableColumn } from '@po-ui/ng-components';
import { OwnersService } from './shared/services/owners.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-owners',
  templateUrl: './owners.component.html',
  styleUrls: ['./owners.component.css']
})
export class OwnersComponent implements OnInit {
  actions: Array<PoPageAction> = [
    { label: 'Novo', action: this.goToFormOwner.bind(this) }
  ];

  breadcrumb: PoBreadcrumb = {
    items: [
      { label: 'Home', link: '/' },
      { label: 'Tutores' }
    ]
  }

  columns!: Array<PoTableColumn>;
  owners: Owners = {
    items: [],
    hasNext: false,
    remainingRecords: 0
  }
  isLoading = false;
  hasNextPage = false;
  // pagina inicial
  page = 1;
  // tamanho da pagina
  pageSize = 10;

  textRemainingRecords!: string;
  totalOwners: number = 0;

  constructor(
    private ownersService: OwnersService,
    private poNotificationService: PoNotificationService,
    private router: Router

  ) {

  }

  ngOnInit(): void {
    this.setColumns();
    this.getOwners(this.page, this.pageSize);
  }

  setColumns(): void {
    this.columns = [
      { property: 'id', label: 'Codigo', type: 'link', action: (row: string) => this.goToFormEdit(row) },
      { property: 'name', label: 'Nome' },
      { property: 'rg', label: 'RG', visible: false },
      { property: 'cpf', label: 'CPF' },
      { property: 'tel1', label: 'Telefone 1' },
      { property: 'tel2', label: 'Telefone 2', visible: false },
      {
        property: 'pets', label: 'Pets', type: 'icon', icons: [
          { value: 'view-pet', icon: 'po-icon-eye', tooltip: 'Visualizar Pet' },
          { value: 'include-pet', icon: 'po-icon-plus-circle', tooltip: 'Inluir Pet' }
        ]
      },
    ]
  }


  getOwners(page: number, pageSize: number): void {

    this.ownersService.get(page, pageSize).subscribe({
      next: (owners: Owners) => this.onGetSucess(owners),
      error: (error: any) => this.poNotificationService.error('Falha ao retornar tutores')

    })
    // this.owners.items = [
    //   {
    //     id: '00001',
    //     name: 'Teste',
    //     rg: '2824282',
    //     cpf: '1811545',
    //     email: 'meu@meu.com.br',
    //     tel1: '(99) 9991-4891',
    //     tel2: '(99) 8989-0909'
    //   }
    // ]
  }

  onGetSucess(owners: Owners): void {
    //- aqui é feito a concatenação do resultado, para que
    //- coloque os dados numa listagem, ao invés de carrega como uma
    //- unica pagina.
    if (this.owners.items.length === 0) {
      this.owners.items = owners.items;
    } else {
      this.owners.items = this.owners.items.concat(owners.items);
    }

    this.isLoading = true;
    this.hasNextPage = owners.hasNext;
    this.totalOwners = owners.items.length;
    this.textRemainingRecords = `Monstrando ${this.totalOwners} de ${this.totalOwners + owners.remainingRecords}`
  }

  showMoreItems(): void {
    this.page += 1;
    this.getOwners(this.page, this.pageSize);
  }

  goToFormOwner(): void {
    this.router.navigate(['owners/new'])
  }

  goToFormEdit(id: string): void {
    this.router.navigate(['owners/edit', id]);
  }
}



