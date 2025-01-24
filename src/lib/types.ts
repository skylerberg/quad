export type Condition = { type: 'SumGreaterThan', amount: number } |
    { type: 'EachColor', } |
    { type: 'EachNumber', color: Array<Number> } |
    { type: 'OddOrColor', color: Color } |
    { type: 'EvenOrColor', color: Color }
