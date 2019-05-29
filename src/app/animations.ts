import {
  trigger,
  transition,
  query,
  style,
  animate,
  group,
  stagger,
} from '@angular/animations';

const slideStyle = {
  position: 'fixed',
  zIndex: 1000,
  top: 0,
  bottom: 0,
  width: '100%',
};

const transitionStyle = '.6s cubic-bezier(.8, -0.6, 0.2, 1.5)';

export const routeAnimation = trigger('slideIn', [
  transition('ChatList => Chat', [
    group([
      query(
        ':enter',
        [
          style({
            ...slideStyle,
            left: '100%',
          }),
          animate(transitionStyle, style({ left: 0 })),
        ],
        { optional: true },
      ),
      query(
        ':leave',
        [
          style({
            position: 'relative',
          }),
        ],
        { optional: true },
      ),
    ]),
  ]),
  transition('Chat => ChatList', [
    query(
      ':leave',
      [
        style({
          ...slideStyle,
          left: 0,
        }),
        animate(transitionStyle, style({ left: '100%' })),
      ],
      { optional: true },
    ),
  ]),
]);

export const chatListAnimation = [
  trigger('chats', [
    transition(':enter', [
      style({ transform: 'scale(0.5)', opacity: 0 }),
      animate(
        transitionStyle,
        style({ transform: 'scale(1)', opacity: 1 }),
      ),
    ]),
  ]),
];
