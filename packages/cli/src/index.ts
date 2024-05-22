import { main } from 'effection';
import { cli } from './cli';

main(cli(process.argv.slice(2)))
