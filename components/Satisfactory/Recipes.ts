import { Recipe } from './Satisfactory.types';

export const RECIPES: Recipe[] = [
  {
    inputs: [
      ['crystal oscillator', 2.8125],
      ['circuit board', 7.5]
    ],
    outputs: [['computer', 2.8125]]
  },
  {
    inputs: [
      ['modular frame', 10],
      ['steel pipe', 30],
      ['encased industrial beam', 10],
      ['screw', 200]
    ],
    outputs: [['heavy modular frame', 2]]
  },
  {
    inputs: [
      ['reinforced iron plate', 7.5],
      ['screw', 140]
    ],
    outputs: [['modular frame', 5]]
  },
  {
    inputs: [['steel beam', 5]],
    outputs: [['screw', 260]]
  },
  {
    inputs: [['iron ingot', 30]],
    outputs: [['iron plate', 20]]
  },
  {
    inputs: [['iron ingot', 15]],
    outputs: [['iron rod', 15]]
  },
  // {
  //   inputs: [['steel ingot', 60]],
  //   outputs: [['steel beam', 15]]
  // },
  // {
  //   inputs: [
  //     ['iron ore', 35],
  //     ['water', 20]
  //   ],
  //   outputs: [['iron ingot', 65]]
  // },
  {
    inputs: [['iron ore', 30]],
    outputs: [['iron ingot', 30]]
  },
  // {
  //   // Right now I'm just toggling alternates by editing this file...
  //   inputs: [
  //     ['iron ore', 20],
  //     ['copper ore', 20]
  //   ],
  //   outputs: [['iron ingot', 50]]
  // },
  // {
  //   inputs: [
  //     ['iron plate', 90],
  //     ['screw', 250]
  //   ],
  //   outputs: [['reinforced iron plate', 15]]
  // },
  // {
  //   inputs: [['steel ingot', 20]],
  //   outputs: [['steel pipe', 20]]
  // },
  // {
  //   inputs: [
  //     ['steel beam', 24],
  //     ['concrete', 30]
  //   ],
  //   outputs: [['encased industrial beam', 6]]
  // },
  {
    inputs: [
      ['quartz crystal', 18],
      ['reinforced iron plate', 2.5],
      ['cable', 14]
    ],
    outputs: [['crystal oscillator', 1]]
  },
  {
    inputs: [
      ['limestone', 120],
      ['water', 100]
    ],
    outputs: [['concrete', 80]]
  },
  // {
  //   inputs: [['limestone', 45]],
  //   outputs: [['concrete', 15]]
  // },
  // {
  //   inputs: [
  //     ['copper ingot', 12],
  //     ['caterium ingot', 3]
  //   ],
  //   outputs: [['wire', 90]]
  // },
  {
    inputs: [['copper ingot', 15]],
    outputs: [['wire', 30]]
  },
  {
    inputs: [['wire', 60]],
    outputs: [['cable', 30]]
  },
  {
    inputs: [
      ['copper sheet', 27.5],
      ['silica', 27.5]
    ],
    outputs: [['circuit board', 12.5]]
  },
  {
    inputs: [['raw quartz', 37.5]],
    outputs: [['quartz crystal', 22.5]]
  },
  // {
  //   inputs: [
  //     ['raw quartz', 67.5],
  //     ['water', 37.5]
  //   ],
  //   outputs: [['quartz crystal', 52.5]]
  // },
  {
    inputs: [['raw quartz', 22.5]],
    outputs: [['silica', 37.5]]
  },
  // {
  //   inputs: [
  //     ['raw quartz', 11.25],
  //     ['limestone', 18.75]
  //   ],
  //   outputs: [['silica', 26.25]]
  // },
  {
    inputs: [
      ['quickwire', 100],
      ['copper sheet', 25]
    ],
    outputs: [['a.i. limiter', 5]]
  },
  {
    inputs: [
      ['quickwire', 90],
      ['silica', 37.5],
      ['circuit board', 3]
    ],
    outputs: [['high-speed connector', 3]]
  },
  {
    inputs: [
      ['caterium ingot', 7.5],
      ['copper ingot', 37.5]
    ],
    outputs: [['quickwire', 90]]
  },
  {
    inputs: [
      ['water', 24],
      ['caterium ore', 24]
    ],
    outputs: [['caterium ingot', 12]]
  },
  {
    inputs: [
      ['iron ingot', 40],
      ['coal', 40]
    ],
    outputs: [['steel ingot', 60]]
  },
  {
    inputs: [
      ['copper ore', 50],
      ['iron ore', 25]
    ],
    outputs: [['copper ingot', 100]]
  },
  { inputs: [['copper ingot', 20]], outputs: [['copper sheet', 10]] }
];
