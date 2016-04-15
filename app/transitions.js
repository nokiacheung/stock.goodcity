export default function(){
  this.transition(
    this.fromRoute('orders'),
    this.toRoute('order'),
    this.use('toLeft', {duration: 300}),
    this.reverse('toRight', {duration: 300})
  );
}
