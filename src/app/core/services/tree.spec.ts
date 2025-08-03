import { TestBed } from '@angular/core/testing';

import { Tree } from './tree';

describe('Tree', () => {
  let service: Tree;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Tree);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
