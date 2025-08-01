// import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { IonicModule, PopoverController } from '@ionic/angular';
// import { ActivatedRoute, Router } from '@angular/router';
// import { UseraboutMenuComponent } from '../components/userabout-menu/userabout-menu.component'; // Make sure the path is correct
// import { getDatabase, ref, get } from 'firebase/database';
// import { ActionSheetController, ToastController } from '@ionic/angular';
// import { remove } from 'firebase/database';


// @Component({
//   selector: 'app-userabout',
//   templateUrl: './userabout.page.html',
//   styleUrls: ['./userabout.page.scss'],
//   standalone: true,
//   schemas: [CUSTOM_ELEMENTS_SCHEMA],
//   imports: [IonicModule, CommonModule],
// })
// export class UseraboutPage implements OnInit {
//   receiverId: string = '';
//   receiver_phone: string = '';
//   isGroup: boolean = false;
//   receiver_name: string = '';
//   chatType: 'private' | 'group' = 'private';
//   groupName = '';

//   groupMembers: {
//     user_id: any; name: string; phone: string; avatar?: string 
// }[] = [];
//   groupId = "";
//   actionSheetCtrl: any;
//   toastCtrl: any;

//   constructor(
//     private router: Router,
//     private route: ActivatedRoute,
//     private popoverCtrl: PopoverController
//   ) { }

//   ngOnInit() {
//     this.route.queryParams.subscribe(async params => {
//       this.receiverId = params['receiverId'] || '';
//       this.receiver_phone = params['receiver_phone'] || '';
//       this.isGroup = params['isGroup'] === 'true';
//       this.chatType = this.isGroup ? 'group' : 'private';
//       this.receiver_name = localStorage.getItem('receiver_name') || '';
//       this.groupId = this.route.snapshot.queryParamMap.get('groupId') || '';
//       console.log("fkdsdjfg", this.receiverId)
//       if (this.chatType === 'group') {
//         // 👇 Fetch group name from Firebase
//         await this.fetchGroupName(this.receiverId);
//         // console.log("fkdsdjfg", this.receiverId);
//       }
//     });
//   }

//   isScrolled = false;

//   onScroll(event: any) {
//     const scrollTop = event.detail.scrollTop;
//     this.isScrolled = scrollTop > 10;
//   }

//   async openMenu(ev: any) {
//     const popover = await this.popoverCtrl.create({
//       component: UseraboutMenuComponent,
//       event: ev,
//       translucent: true,
//       componentProps: {
//         chatType: this.chatType,
//         groupId: this.chatType === 'group' ? this.receiverId : ''  // ✅ Pass groupId only for group chat
//       }
//     });

//     await popover.present();

//     const { data } = await popover.onDidDismiss();
//     if (data?.action) {
//       console.log('Action selected:', data.action);

//       // ✅ Optionally refresh group info if name/member was updated
//       if (data.action === 'memberAdded' || data.action === 'nameChanged') {
//         this.fetchGroupName(this.receiverId);
//       }
//     }
//   }


//   // goToHome() {
//   //   this.router.navigate(['/home-screen']);
//   // }

//   goBackToChat() {
//     this.router.navigate(['/chatting-screen'], {
//       queryParams: {
//         receiverId: this.receiverId,
//         receiver_phone: this.receiver_phone,
//         isGroup: this.isGroup
//       }
//     });
//   }

//   onAddMember() {
//   const memberPhones = this.groupMembers.map(member => member.phone);

//   this.router.navigate(['/add-members'], {
//     queryParams: {
//       groupId: this.receiverId,
//       members: JSON.stringify(memberPhones) // pass as string
//     }
//   });
// } 

// async openActionSheet(member: any) {
//   const actionSheet = await this.actionSheetCtrl.create({
//     header: member.name,
//     buttons: [
//       {
//         text: 'Remove from group',
//         role: 'destructive',
//         icon: 'person-remove',
//         handler: () => this.removeMemberFromGroup(member)
//       },
//       {
//         text: 'Cancel',
//         role: 'cancel'
//       }
//     ]
//   });
//   await actionSheet.present();
// }


// async removeMemberFromGroup(member: any) {
//   const db = getDatabase();
//   const groupId = this.groupId; // Ensure this is set from query param or elsewhere

//   try {
//     await remove(ref(db, `groups/${groupId}/members/${member.user_id}`));

//     // Remove from UI list
//     this.groupMembers = this.groupMembers.filter(m => m.user_id !== member.user_id);

//     const toast = await this.toastCtrl.create({
//       message: `${member.name} removed from group`,
//       duration: 2000,
//       color: 'success'
//     });
//     await toast.present();
//   } catch (error) {
//     console.error('Error removing member:', error);
//     const toast = await this.toastCtrl.create({
//       message: `Error removing member`,
//       duration: 2000,
//       color: 'danger'
//     });
//     await toast.present();
//   }
// }


//   // async fetchGroupName(groupId: string) {
//   //     try {
//   //       const db = getDatabase();
//   //       const groupRef = ref(db, `groups/${groupId}`);
//   //       const snapshot = await get(groupRef);

//   //       if (snapshot.exists()) {
//   //         const groupData = snapshot.val();
//   //         this.groupName = groupData.name || 'Group';
//   //       } else {
//   //         this.groupName = 'Group';
//   //       }
//   //     } catch (error) {
//   //       console.error('Error fetching group name:', error);
//   //       this.groupName = 'Group';
//   //     }
//   //   }

//   async fetchGroupName(groupId: string) {
//     try {
//       const db = getDatabase();
//       const groupRef = ref(db, `groups/${groupId}`);
//       const snapshot = await get(groupRef);

//       if (snapshot.exists()) {
//         const groupData = snapshot.val();
//         // console.log("group name:",groupData);
//         this.groupName = groupData.name || 'Group';
//         // console.log("Grouppppppp name:",this.groupName);

//         // ✅ Fetch members
//         // if (groupData.members) {
//         //   this.groupMembers = Object.values(groupData.members);
//         // }
//         if (groupData.members) {
//           this.groupMembers = Object.entries(groupData.members).map(([userId, userData]: [string, any]) => ({
//             user_id: userId,
//             ...userData
//           }));
//         } else {
//           this.groupMembers = [];
//         }
//       } else {
//         this.groupName = 'Group';
//         this.groupMembers = [];
//       }
//     } catch (error) {
//       console.error('Error fetching group name or members:', error);
//       this.groupName = 'Group';
//       this.groupMembers = [];
//     }
//     console.log("memebers name : ", this.groupMembers)
//   }

// }



import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, PopoverController, ActionSheetController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { getDatabase, ref, get, remove, set, update } from 'firebase/database';
import { UseraboutMenuComponent } from '../components/userabout-menu/userabout-menu.component';
import { ActionSheetButton } from '@ionic/angular';
import { FirebaseChatService } from '../services/firebase-chat.service';
import { SecureStorageService } from '../services/secure-storage/secure-storage.service';
import { NavController } from '@ionic/angular';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-userabout',
  templateUrl: './userabout.page.html',
  styleUrls: ['./userabout.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, CommonModule],
})

export class UseraboutPage implements OnInit {
  receiverId: string = '';
  receiver_phone: string = '';
  receiver_name: string = '';
  groupId: string = '';
  isGroup: boolean = false;
  chatType: 'private' | 'group' = 'private';
  groupName: string = '';
  // groupMembers: { user_id: string; name: string; phone: string; avatar?: string }[] = [];
  groupMembers: {
    user_id: string;
    name: string;
    phone: string;
    avatar?: string;
    role?: string;
    phone_number?: string;
  }[] = [];
  commonGroups: any[] = [];
  receiverAbout: string = '';
  receiverAboutUpdatedAt: string = '';

  groupDescription: string = '';
  groupCreatedBy: string = '';
  groupCreatedAt: string = '';
  hasPastMembers = false;




  isScrolled: boolean = false;
  currentUserId = "";
  showPastMembersButton: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private popoverCtrl: PopoverController,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController,
    private firebaseChatService: FirebaseChatService,
    private secureStorage: SecureStorageService,
    private navCtrl: NavController,
    private zone: NgZone,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      this.receiverId = params['receiverId'] || '';
      this.receiver_phone = params['receiver_phone'] || '';
      this.isGroup = params['isGroup'] === 'true';
      this.chatType = this.isGroup ? 'group' : 'private';
      // this.receiver_name = localStorage.getItem('receiver_name') || '';
      this.receiver_name = (await this.secureStorage.getItem('receiver_name')) || '';
      this.currentUserId = localStorage.getItem('userId') || '';
      this.groupId = this.route.snapshot.queryParamMap.get('receiverId') || '';
      console.log("gruop id checking:", this.groupId);

      console.log("dasfsdfgdg",this.isGroup);
      // if (this.chatType === 'group') {
      //   await this.fetchGroupName(this.receiverId);
      // }
      if (this.chatType === 'group') {
        await this.fetchGroupName(this.receiverId);
        await this.fetchGroupMeta(this.receiverId);  // 👈 fetch group description
      } else {
        await this.fetchReceiverAbout(this.receiverId);  // 👈 fetch private user about
      }
    });
    this.checkForPastMembers();
    // this.checkForPastMembers();
    this.findCommonGroups(this.currentUserId, this.receiverId);

  }

  ionViewWillEnter() {
    this.route.queryParams.subscribe(async params => {
      this.receiverId = params['receiverId'] || '';
      this.receiver_phone = params['receiver_phone'] || '';
      this.isGroup = params['isGroup'] === 'true';
      this.chatType = this.isGroup ? 'group' : 'private';
      // this.receiver_name = localStorage.getItem('receiver_name') || '';
      // this.receiver_name = (await this.secureStorage.getItem('receiver_name')) || '';
      this.receiver_name = params['receiver_name'] || '';  //this will not update in real device
      console.log("redirect name", this.receiver_name);
      this.currentUserId = localStorage.getItem('userId') || '';
      this.groupId = this.route.snapshot.queryParamMap.get('receiverId') || '';

      // console.log("dasfsdfgdg",this.isGroup);
      // console.log("dasfsdfgdg",params['isGroup']);

      // if (this.chatType === 'group') {
      //   await this.fetchGroupName(this.receiverId);
      // }
      if (this.chatType === 'group') {
        await this.fetchGroupName(this.receiverId);
        await this.fetchGroupMeta(this.receiverId);  // 👈 fetch group description
      } else {
        await this.fetchReceiverAbout(this.receiverId);  // 👈 fetch private user about
      }
    });
    this.checkForPastMembers();
    this.findCommonGroups(this.currentUserId, this.receiverId);
  }

  onScroll(event: any) {
    const scrollTop = event.detail.scrollTop;
    this.isScrolled = scrollTop > 10;
  }

  goBackToChat() {
    this.router.navigate(['/chatting-screen'], {
      queryParams: {
        receiverId: this.receiverId,
        receiver_phone: this.receiver_phone,
        isGroup: this.isGroup
      }
    });
  }

  onAddMember() {
    // console.log("fjsdkfjdgdg on clickherees")
    const memberPhones = this.groupMembers.map(member => member.phone);
    this.router.navigate(['/add-members'], {
      queryParams: {
        groupId: this.receiverId,
        members: JSON.stringify(memberPhones)
      }
    });
  }


  viewPastMembers() {
    this.router.navigate(['/view-past-members'], {
      queryParams: {
        groupId: this.receiverId
      }
    });
  }


  async openMenu(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: UseraboutMenuComponent,
      event: ev,
      translucent: true,
      componentProps: {
        chatType: this.chatType,
        groupId: this.chatType === 'group' ? this.receiverId : ''
      }
    });

    await popover.present();

    const { data } = await popover.onDidDismiss();
    if (data?.action === 'memberAdded' || data?.action === 'nameChanged') {
      this.fetchGroupName(this.receiverId);
    }
  }

  openGroupDescriptionPage() {
    if (this.chatType === 'group') {
      this.navCtrl.navigateForward(`/group-description`, {
        queryParams: {
          receiverId: this.receiverId,
          currentDescription: this.groupDescription,
          receiver_name: this.receiver_name,
          isGroup: this.isGroup
        }
      });
    }
    // console.log("this.chatType === 'group'",this.isGroup);
  }

  // async openActionSheet(member: any) {
  //   const actionSheet = await this.actionSheetCtrl.create({
  //     header: member.name,
  //     buttons: [
  //       {
  //         text: 'Remove from group',
  //         role: 'destructive',
  //         icon: 'person-remove',
  //         handler: () => this.removeMemberFromGroup(member)
  //       },
  //       {
  //         text: 'Cancel',
  //         role: 'cancel'
  //       }
  //     ]
  //   });
  //   await actionSheet.present();
  // }

  async openActionSheet(member: any) {
    const buttons: ActionSheetButton[] = [
      {
        text: 'Message',
        icon: 'chatbox',
        handler: () => this.messageMember(member)
      },
    ];

    // Only show "Remove from group" if current user is admin
    // And not removing self
    const isCurrentUserAdmin = this.groupMembers.find(m => m.user_id === this.currentUserId)?.role === 'admin';
    const isTargetUserAdmin = member.role === 'admin';
    const isSelf = member.user_id === this.currentUserId;

    if (isCurrentUserAdmin && !isSelf) {
      if (isTargetUserAdmin) {
        buttons.push({
          text: 'Dismiss as Admin',
          icon: 'remove-circle',
          handler: () => this.dismissAdmin(member)
        });
      } else {
        buttons.push({
          text: 'Make Admin',
          icon: 'person-add',
          handler: () => this.makeAdmin(member)
        });
      }

      buttons.push({
        text: 'Remove from Group',
        icon: 'person-remove',
        role: 'destructive',
        handler: () => this.removeMemberFromGroup(member)
      });
    }

    buttons.push({
      text: 'Cancel',
      role: 'cancel'
    });

    const actionSheet = await this.actionSheetCtrl.create({
      header: member.name,
      buttons
    });

    await actionSheet.present();
  }

  //in this need of updation -----------------------------------------------------------------------------------------
  // messageMember(member: any) {
  //   const senderId = localStorage.getItem('userId') || '';
  //   const receiverId = member.user_id;
  //   // console.log("membewr id", receiverId);

  //   if (!senderId || !receiverId) {
  //     alert('Missing sender or receiver ID');
  //     return;
  //   }

  //   const roomId = senderId < receiverId ? `${senderId}_${receiverId}` : `${receiverId}_${senderId}`;
  //   // console.log("roome id created", roomId);
  //   const receiverPhone = member.phone_number || member.phone;

  //   // Optional: set for UI display on chatting screen
  //   // localStorage.setItem('receiver_name', member.name);

  //   // Navigate with all required params
  //   // this.router.navigate(['/chatting-screen'], {
  //   //   queryParams: {
  //   //     receiverId: receiverId,
  //   //     receiver_phone: receiverPhone,
  //   //     roomId: roomId,
  //   //     chatType: 'private'
  //   //   }
  //   // });
  //   this.router.navigate(['/chatting-screen'], {
  //   queryParams: {
  //     receiverId: receiverId,
  //     receiver_phone: receiverPhone,
  //     roomId: roomId,
  //     receiver_name: member.name,
  //     chatType: 'private'
  //   }
  // });
  // }

  messageMember(member: any) {
    const senderId = localStorage.getItem('userId') || '';
    const receiverId = member.user_id;

    if (!senderId || !receiverId) {
      alert('Missing sender or receiver ID');
      return;
    }

    const roomId = senderId < receiverId ? `${senderId}_${receiverId}` : `${receiverId}_${senderId}`;
    const receiverPhone = member.phone_number || member.phone;

    this.router.navigate(['/chatting-screen'], {
      queryParams: {
        receiverId: receiverId,
        receiver_phone: receiverPhone,
        roomId: roomId,
        receiver_name: member.name,
        chatType: 'private'
      }
    });
  }


  async makeAdmin(member: any) {
    const db = getDatabase();
    const groupId = this.groupId || this.receiverId;

    if (!groupId || !member?.user_id) {
      console.error('Missing groupId or member.user_id');
      return;
    }

    const memberRef = ref(db, `groups/${groupId}/members/${member.user_id}`);

    try {
      await update(memberRef, { role: 'admin' });

      // ✅ Optional: Update in UI
      const updatedMemberIndex = this.groupMembers.findIndex(m => m.user_id === member.user_id);
      if (updatedMemberIndex !== -1) {
        this.groupMembers[updatedMemberIndex].role = 'admin';
      }

      const toast = await this.toastCtrl.create({
        message: `${member.name} is now an admin`,
        duration: 2000,
        color: 'success'
      });
      await toast.present();
    } catch (error) {
      console.error('Error promoting member to admin:', error);
      const toast = await this.toastCtrl.create({
        message: `Failed to make ${member.name} admin`,
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
    }
  }

  async dismissAdmin(member: any) {
    const db = getDatabase();
    const groupId = this.groupId || this.receiverId;

    if (!groupId || !member?.user_id) {
      console.error('Missing groupId or member.user_id');
      return;
    }

    const memberRef = ref(db, `groups/${groupId}/members/${member.user_id}`);

    try {
      await update(memberRef, { role: 'member' });

      // ✅ Optional: Update in local UI
      const updatedIndex = this.groupMembers.findIndex(m => m.user_id === member.user_id);
      if (updatedIndex !== -1) {
        this.groupMembers[updatedIndex].role = 'member';
      }

      const toast = await this.toastCtrl.create({
        message: `${member.name} is no longer an admin`,
        duration: 2000,
        color: 'medium'
      });
      await toast.present();
    } catch (error) {
      console.error('Error demoting admin to member:', error);
      const toast = await this.toastCtrl.create({
        message: `Failed to dismiss ${member.name} as admin`,
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
    }
  }

  async removeMemberFromGroup(member: any) {
    const db = getDatabase();
    const groupId = this.groupId || this.receiverId;

    if (!groupId || !member?.user_id) {
      console.error('Missing groupId or member.user_id');
      return;
    }

    const memberPath = `groups/${groupId}/members/${member.user_id}`;
    const pastMemberPath = `groups/${groupId}/pastmembers/${member.user_id}`;

    console.log('Deactivating and moving to pastmembers:', memberPath);

    try {
      // Update the status to "inactive" in members first
      await update(ref(db, memberPath), {
        ...member,
        status: 'inactive'
      });

      // Move member to pastmembers node
      await set(ref(db, pastMemberPath), {
        ...member,
        status: 'inactive',
        removedAt: new Date().toLocaleString()  // optional timestamp
      });

      // Remove from current members
      await remove(ref(db, memberPath));

      // Remove from UI
      this.groupMembers = this.groupMembers.filter(m => m.user_id !== member.user_id);

      const toast = await this.toastCtrl.create({
        message: `${member.name} removed from group`,
        duration: 2000,
        color: 'success'
      });
      await toast.present();
    } catch (error) {
      console.error('Error moving member to pastmembers:', error);
      const toast = await this.toastCtrl.create({
        message: `Error removing member`,
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
    }
  }

  async checkForPastMembers() {
  if (!this.groupId) return;

  const db = getDatabase();
  const pastRef = ref(db, `groups/${this.groupId}/pastmembers`);

  try {
    const snapshot = await get(pastRef);
    const exists = snapshot.exists();

    // ✅ Run inside Angular zone to trigger change detection
    this.zone.run(() => {
      this.hasPastMembers = exists;
    });
  } catch (error) {
    console.error('Error checking past members:', error);
    this.zone.run(() => {
      this.hasPastMembers = false;
    });
  }
}

  async createGroupWithMember() {
    const currentUserId = localStorage.getItem('userId');
    const currentUserPhone = localStorage.getItem('phone_number');
    const currentUserName = localStorage.getItem('name') || currentUserPhone;

    if (!currentUserId || !this.receiverId || !this.receiver_name) {
      console.error('Missing data for group creation');
      return;
    }

    const groupId = `group_${Date.now()}`;
    const groupName = `${currentUserName}, ${this.receiver_name}`;

    const members = [
      {
        user_id: currentUserId,
        name: currentUserName,
        phone_number: currentUserPhone
      },
      {
        user_id: this.receiverId,
        name: this.receiver_name,
        phone_number: this.receiver_phone
      }
    ];

    try {
      await this.firebaseChatService.createGroup(groupId, groupName, members, currentUserId);
      this.router.navigate(['/chatting-screen'], {
        queryParams: { receiverId: groupId, isGroup: true }
      });
    } catch (error) {
      console.error('Error creating group:', error);
    }
  }

  async findCommonGroups(currentUserId: string, receiverId: string) {
    if (!currentUserId || !receiverId) return;

    const db = getDatabase();
    const groupsRef = ref(db, 'groups');

    try {
      const snapshot = await get(groupsRef);
      if (snapshot.exists()) {
        const allGroups = snapshot.val();
        const matchedGroups: any[] = [];

        Object.entries(allGroups).forEach(([groupId, groupData]: any) => {
          const members = groupData.members || {};

          if (members[currentUserId] && members[receiverId]) {
            matchedGroups.push({
              groupId,
              name: groupData.name || 'Unnamed Group'
            });
          }
        });

        this.commonGroups = matchedGroups;
        console.log('Common Groups:', this.commonGroups);
      }
    } catch (error) {
      console.error('Error fetching common groups:', error);
    }
  }

  async fetchGroupMeta(groupId: string) {
    const db = getDatabase();
    const groupRef = ref(db, `groups/${groupId}`);

    try {
      const snapshot = await get(groupRef);
      if (snapshot.exists()) {
        const groupData = snapshot.val();
        this.groupDescription = groupData.description || 'No group description.';
        this.groupCreatedBy = groupData.createdByName || 'Unknown';
        this.groupCreatedAt = groupData.createdAt || '';
      }
    } catch (error) {
      console.error('Error fetching group meta:', error);
    }
  }

  async fetchReceiverAbout(userId: string) {
    const db = getDatabase();
    const userRef = ref(db, `users/${userId}`);

    try {
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        this.receiverAbout = userData.about || 'Hey there! I am using WhatsApp.';
        this.receiverAboutUpdatedAt = userData.updatedAt || '';
      }
    } catch (error) {
      console.error('Error fetching receiver about info:', error);
    }
  }


  async fetchGroupName(groupId: string) {
    try {
      const db = getDatabase();
      const groupRef = ref(db, `groups/${groupId}`);
      const snapshot = await get(groupRef);

      if (snapshot.exists()) {
        const groupData = snapshot.val();
        this.groupName = groupData.name || 'Group';
        this.groupMembers = groupData.members
          ? Object.entries(groupData.members).map(([userId, userData]: [string, any]) => ({
            // user_id: userId,
            // ...userData
            user_id: userId,
            phone_number: userData.phone_number,
            ...userData
          }))
          : [];
      } else {
        this.groupName = 'Group';
        this.groupMembers = [];
      }
    } catch (error) {
      console.error('Error fetching group name or members:', error);
      this.groupName = 'Group';
      this.groupMembers = [];
    }
    console.log("group members", this.groupMembers);
  }
}
