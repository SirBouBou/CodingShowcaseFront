import { beforeEach, describe, expect, it, vi } from "vitest";
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FallingSand1Component } from './falling-sand-1.component';

const { mockP5 } = vi.hoisted(() => ({
    mockP5: {
        remove: vi.fn(),
    },
}));

vi.mock('p5', () => ({
    default: class MockP5 {
        remove = mockP5.remove;
    },
}));

describe('FallingSand1Component', () => {
    let component: FallingSand1Component;
    let fixture: ComponentFixture<FallingSand1Component>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FallingSand1Component]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FallingSand1Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should remove p5 on destroy', () => {
        component.ngOnDestroy();
        expect(mockP5.remove).toHaveBeenCalled();
    });
});
