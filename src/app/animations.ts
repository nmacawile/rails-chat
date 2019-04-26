import {
  trigger,
  transition,
  query,
  style,
  animate,
  group,
} from '@angular/animations';

const slideStyle = {
  position: 'fixed',
  zIndex: 1000,
  top: 0,
  bottom: 0,
  width: '100%',
};

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
          animate(100, style({ left: 0 })),
        ],
        { optional: true },
      ),
      query(
        ':leave',
        [
           style({
             position: 'relative'
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
        animate(100, style({ left: '100%' })),
      ],
      { optional: true },
    ),
  ]),
]);
