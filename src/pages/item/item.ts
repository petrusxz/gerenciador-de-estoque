import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from 'angularfire2/firestore';

import { ItemModel } from '../../models/item.model';

import { ToastService } from '../../services/toast.service';
import { LoadingService } from '../../services/loading.service';

@IonicPage()
@Component({
  selector: 'page-item',
  templateUrl: 'item.html'
})
export class ItemPage {
  private item: ItemModel = new ItemModel();
  private itemsCollection: AngularFirestoreCollection<ItemModel>;
  private itemDoc: AngularFirestoreDocument<ItemModel>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afs: AngularFirestore,
    private toastService: ToastService,
    private loadingService: LoadingService
  ) {}

  ionViewDidLoad(): void {
    const selectedItem = this.navParams.get('item');

    if (selectedItem) this.item = selectedItem;
  }

  openFileChooser(event: any): void {
    let file = event.target.files[0];
    if (file.type.includes('image'))
      this.fileToBase64(file);
  }

  fileToBase64(file: any): void {
    let reader = new FileReader();

    reader.onload = e => {
      let base64 = reader.result;
      this.item.picture = `data:image/jpeg;base64,${base64}`;
    };

    reader.readAsDataURL(file);
  }

  saveItem(item: ItemModel): void {
    this.loadingService.presentLoading();

    if (!item.id) {
      this.item.id = this.afs.createId();
      this.item.creationDate = new Date();
      this.itemsCollection = this.afs.collection<ItemModel>('items');
      this.itemsCollection
        .doc(this.item.id)
        .set(Object.assign({}, this.item))
        .then(() => {
          this.toastService.presentToast('Item adicionado.');
          this.loadingService.dissmissLoading();
          this.navCtrl.pop();
        });
    } else {
      this.itemDoc = this.afs.doc<ItemModel>(`items/${this.item.id}`);
      this.itemDoc.update(Object.assign({}, this.item));
      this.toastService.presentToast('Item editado.');
      this.loadingService.dissmissLoading();
      this.navCtrl.pop();
    }
  }
}
