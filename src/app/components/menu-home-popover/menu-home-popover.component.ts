import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, PopoverController } from '@ionic/angular';

export type HomeMenuAction =
  | 'addShortcut' | 'viewContact' | 'markUnread' | 'markRead' | 'selectAll'
  | 'lockChat' | 'lockChats' | 'favorite' | 'addToList' | 'block'
  | 'exitGroup' | 'exitGroups' | 'groupInfo';

@Component({
  selector: 'app-menu-home-popover',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './menu-home-popover.component.html',
  styleUrls: ['./menu-home-popover.component.scss']
})
export class MenuHomePopoverComponent {
  // common helpers
  @Input() canLock = true;
  @Input() allSelected = false;
  @Input() isAllSelectedMode = false;

  // selection buckets
  @Input() isSingleUser = false;
  @Input() isMultiUsers = false;
  @Input() isSingleGroup = false;
  @Input() isMultiGroups = false;
  @Input() isMixedChats = false;

  // 👇 NEW: unread visibility flags
  @Input() canMarkReadSingle = false;   // single selection has unread>0
  @Input() canMarkUnreadSingle = false; // single selection has unread==0
  @Input() canMarkReadMulti = false;    // at least one selected has unread>0
  @Input() canMarkUnreadMulti = false;  // all selected have unread==0  (optional)

  constructor(private popover: PopoverController) {}
  choose(action: HomeMenuAction) { this.popover.dismiss({ action }); }
  close() { this.popover.dismiss(); }
}
