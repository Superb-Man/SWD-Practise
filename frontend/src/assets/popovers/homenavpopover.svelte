<script>

    import { Popover } from 'flowbite-svelte'
    let placement = 'bottom'

    import { storecardtitle, storecardcontent } from '../../store/store'


    let stringCardTitle;
    let stringCardContent;

    storecardtitle.subscribe( title => { stringCardTitle = title} )
    storecardcontent.subscribe( content => { stringCardContent = content} )


</script>

<Popover triggeredBy="[id^='sign-']" { placement } class="w-64 text-sm font-light " title = { stringCardTitle }>{stringCardContent}</Popover>
